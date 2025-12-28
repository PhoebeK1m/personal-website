// initLive.js (FULL REWRITE)

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { VRMAnimationLoaderPlugin } from "@pixiv/three-vrm-animation";

import { initMediapipe, animateWithResults } from "./mediapipe";
import { createOrbitRig } from "./camera";
import { loadVRMModel } from "./vrm";
import { loadBackground } from "./background";

export function initLive({ mount, video, guide }) {
    let currentVrm = null;
    let mixer = null;
    let frameId = null;
    const clock = new THREE.Clock();

    // --- LOADING ---
    let mediapipeReady = false;
    let minimumTimePassed = false;

    // store the mediapipe stop function
    let stopMediapipe = () => {};

    setTimeout(() => {
        minimumTimePassed = true;
        tryRemoveLoadingScreen();
    }, 1500);

    function tryRemoveLoadingScreen() {
        if (mediapipeReady && minimumTimePassed) {
            const loadingScreen = document.getElementById("loading-screen");
            if (loadingScreen) {
                loadingScreen.classList.add("hidden");
                setTimeout(() => loadingScreen.remove(), 800);
            }
        }
    }

    // --- RENDERER / SIZES ---
    const rect = mount.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // --- SCENE ---
    const scene = new THREE.Scene();
    loadBackground(scene);

    const { orbitCamera } = createOrbitRig(renderer);

    // --- RESIZE LISTENER ---
    function onResize() {
        const w = mount.clientWidth || window.innerWidth;
        const h = mount.clientHeight || window.innerHeight;

        orbitCamera.aspect = w / h;
        orbitCamera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // --- LOAD VRM ---
    const gltfLoader = new GLTFLoader();
    gltfLoader.register((p) => new VRMLoaderPlugin(p));
    gltfLoader.register((p) => new VRMAnimationLoaderPlugin(p));
    gltfLoader.crossOrigin = "anonymous";

    loadVRMModel(scene, gltfLoader, "/viseme.vrm").then((vrm) => {
        currentVrm = vrm;
    });

    // --- MOUSE TRACKING (must be stored!) ---
    const mouse = { x: 0, y: 0 };

    function onMouseMove(e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener("mousemove", onMouseMove);

    // --- CAMERA PARAMS ---
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

    // --- MEDIAPIPE ---
    stopMediapipe = initMediapipe(video, guide, () => {
        mediapipeReady = true;
        tryRemoveLoadingScreen();
    });

    // --- ANIMATE LOOP ---
    function animate() {
        frameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();

        if (currentVrm) {
            currentVrm.update(delta);
            animateWithResults(currentVrm);

            // camera smoothing
            const targetYaw = camParams.yawCenter + mouse.x * camParams.yawRange;
            const targetPitch = camParams.pitchCenter + mouse.y * camParams.pitchRange;

            curYaw = THREE.MathUtils.damp(curYaw, targetYaw, camParams.smooth, delta);
            curPitch = THREE.MathUtils.damp(
                curPitch,
                targetPitch,
                camParams.smooth,
                delta
            );

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

    // --- CLEANUP ---
    return () => {
        // stop rAF
        cancelAnimationFrame(frameId);

        // stop mediapipe
        if (typeof stopMediapipe === "function") stopMediapipe();

        // remove listeners
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouseMove);

        // remove canvas first
        if (renderer.domElement && mount.contains(renderer.domElement)) {
            mount.removeChild(renderer.domElement);
        }

        // dispose VRM
        if (currentVrm) {
            currentVrm.scene.traverse((obj) => {
                if (obj.isMesh) {
                    obj.geometry?.dispose();
                    if (obj.material) {
                        if (Array.isArray(obj.material)) {
                            obj.material.forEach((m) => m.dispose());
                        } else obj.material.dispose();
                    }
                }
            });
        }

        // dispose renderer
        renderer.forceContextLoss();
        renderer.dispose();

        // clear scene
        scene.clear();
    };
}
