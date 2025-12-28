import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { VRMAnimationLoaderPlugin } from "@pixiv/three-vrm-animation";

import { createOrbitRig } from "./camera";
import { loadVRMModel } from "./vrm";
import { loadVRMA } from "./vrma";
import { loadBackground, startDanceLights, stopDanceLights } from "./background";
import "./style.css";

export function initThree(mount) {
    // ORIGINAL GLOBALS
    let currentVrm, mixer;
    let idleClip, talkingClip, danceClip;
    let idleAction, talkingAction, danceAction;
    let isDancing = false;

    const clock = new THREE.Clock();

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // SCENE + CAMERA
    const scene = new THREE.Scene();
    const { orbitCamera } = createOrbitRig(renderer);

    loadBackground(scene);

    // RESIZE
    function onResize() {
        orbitCamera.aspect = mount.clientWidth / mount.clientHeight;
        orbitCamera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener("resize", onResize);

    // LOADERS
    const gltfLoader = new GLTFLoader();
    gltfLoader.register(parser => new VRMLoaderPlugin(parser));
    gltfLoader.register(parser => new VRMAnimationLoaderPlugin(parser));
    gltfLoader.crossOrigin = "anonymous";

    // VRM LOADING
    loadVRMModel(scene, gltfLoader, "/viseme.vrm").then(vrm => {
        currentVrm = vrm;
        mixer = new THREE.AnimationMixer(currentVrm.scene);

        // Idle animation
        loadVRMA(gltfLoader, currentVrm, "/idle.vrma", clip => {
            idleClip = clip;
            idleAction = mixer.clipAction(idleClip);
            idleAction.play();
        });

        // Talking
        loadVRMA(gltfLoader, currentVrm, "/talking.vrma", clip => {
            talkingClip = clip;
            talkingAction = mixer.clipAction(talkingClip);
            talkingAction.loop = THREE.LoopRepeat;
        });

        // Dance
        loadVRMA(gltfLoader, currentVrm, "/dance.vrma", clip => {
            danceClip = clip;
            danceAction = mixer.clipAction(danceClip);
            danceAction.loop = THREE.LoopRepeat;
        });
    });

    // MOUSE CAMERA MOVEMENT
    const mouse = { x: 0, y: 0 };
    mount.addEventListener("mousemove", e => {
        mouse.x = (e.clientX / mount.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / mount.clientHeight) * 2 + 1;
    });

    const camParams = {
        radius: 20,
        yawCenter: -Math.PI / 2,
        pitchCenter: 0,
        yawRange: Math.PI / 32,
        pitchRange: Math.PI / 64,
        smooth: 6,
    };

    let curYaw = camParams.yawCenter;
    let curPitch = camParams.pitchCenter;

    // ANIMATE LOOP
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (currentVrm) {
            currentVrm.update(delta);

            const targetYaw = camParams.yawCenter + mouse.x * camParams.yawRange;
            const targetPitch = camParams.pitchCenter + mouse.y * camParams.pitchRange;

            curYaw = THREE.MathUtils.damp(curYaw, targetYaw, camParams.smooth, delta);
            curPitch = THREE.MathUtils.damp(curPitch, targetPitch, camParams.smooth, delta);

            const p = currentVrm.scene.position;
            const r = camParams.radius;

            orbitCamera.position.set(
                p.x + r * Math.sin(curYaw) * Math.cos(curPitch),
                p.y + r * Math.sin(curPitch),
                p.z + r * Math.cos(curYaw) * Math.cos(curPitch)
            );

            orbitCamera.lookAt(p);
        }

        if (mixer) mixer.update(delta);
        renderer.render(scene, orbitCamera);
    }
    animate();

    // RETURN CONTROL API
    return {
        playTalking() {
            if (!mixer || !talkingAction || !idleAction) return;
            talkingAction.reset().play();
            idleAction.crossFadeTo(talkingAction, 0.6, false);
        },
        stopTalking() {
            if (!mixer || !talkingAction || !idleAction) return;
            talkingAction.crossFadeTo(idleAction, 1, false);
            idleAction.reset().play();
        },

        dance() {
            if (!mixer || !danceAction || !idleAction) return;
            isDancing = true;
            startDanceLights();
            danceAction.reset().play();
            idleAction.crossFadeTo(danceAction, 0.6, false);
        },

        stopDance() {
            if (!mixer || !danceAction || !idleAction) return;
            isDancing = false;
            stopDanceLights();
            danceAction.crossFadeTo(idleAction, 1, false);
            idleAction.reset().play();
        },

        cleanup() {
            window.removeEventListener("resize", onResize);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
        }
    };
}
