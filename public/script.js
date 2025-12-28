// //using kalidokit from yeemachine: https://github.com/yeemachine/kalidokit

// //Import Helper Functions from Kalidokit
// const remap = Kalidokit.Utils.remap;
// const clamp = Kalidokit.Utils.clamp;
// const lerp = Kalidokit.Vector.lerp;

// /* THREEJS WORLD SETUP */
// let currentVrm;

// // renderer
// const renderer = new THREE.WebGLRenderer({alpha:true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

// // camera
// const orbitCamera = new THREE.PerspectiveCamera(10,window.innerWidth / window.innerHeight,0.1,1000);
// orbitCamera.position.set(0.0, 1.4, 0);

// // controls
// const orbitControls = new THREE.OrbitControls(orbitCamera, renderer.domElement);
// orbitControls.screenSpacePanning = true;
// orbitControls.target.set(0.0, 1.4, 0.0);
// orbitControls.update();

// // scene
// const scene = new THREE.Scene();

// // light
// const light = new THREE.DirectionalLight(0xffffff);
// light.position.set(1.0, 1.0, 1.0).normalize();
// scene.add(light);

// // Main Render Loop
// const clock = new THREE.Clock();

// /* BACKGROUNG IMAGE SET UP*/
// //import image texture
// const textureLoader = new THREE.TextureLoader();
// textureLoader.load(
//   'https://cdn.glitch.global/63eb2de6-4325-45a2-9cd4-0554515eb3b3/e6835457-699b-4c0d-a10b-d12f253d95d1.image.png?v=1736803994835',
//   (backgroundTexture) => {
//     const aspectRatio = backgroundTexture.image.width / backgroundTexture.image.height;
//     const backgroundPlane = new THREE.Mesh(
//       new THREE.PlaneGeometry(50, 50),
//       new THREE.MeshBasicMaterial({ map: backgroundTexture })
//     );
//     backgroundPlane.scale.set(aspectRatio, 0.5, 0.5);
//     backgroundPlane.position.set(0, 5, -100);
//     scene.add(backgroundPlane);
//   }
// );



// function animate() {
//   requestAnimationFrame(animate);

//   if (currentVrm) {
//     // Update model to render physics
//     currentVrm.update(clock.getDelta());
//   }
//   renderer.render(scene, orbitCamera);
// }
// animate();


// /* VRM CHARACTER SETUP */

// // Import Character VRM
// const loader = new THREE.GLTFLoader();
// loader.crossOrigin = "anonymous";
// // Import model from URL, add your own model here
// loader.load(
//   "https://cdn.glitch.global/63eb2de6-4325-45a2-9cd4-0554515eb3b3/finalfr.vrm?v=1735853990829",

//   gltf => {
//     THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

//     THREE.VRM.from(gltf).then(vrm => {
//       scene.add(vrm.scene);
//       currentVrm = vrm;
//       currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
//       currentVrm.scene.position.set(0, -1.5, -20.0);
//     });
//   },

//   progress =>
//     console.log(
//       "Loading model...",
//       100.0 * (progress.loaded / progress.total),
//       "%"
//     ),

//   error => console.error(error)
// );

// // Animate Rotation Helper function
// const rigRotation = (
//   name,
//   rotation = { x: 0, y: 0, z: 0 },
//   dampener = 1,
//   lerpAmount = 0.3
// ) => {
//   if (!currentVrm) {return}
//   const Part = currentVrm.humanoid.getBoneNode(
//     THREE.VRMSchema.HumanoidBoneName[name]
//   );
//   if (!Part) {return}
  
//   let euler = new THREE.Euler(
//     rotation.x * dampener,
//     rotation.y * dampener,
//     rotation.z * dampener
//   );
//   let quaternion = new THREE.Quaternion().setFromEuler(euler);
//   Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
// };

// // Animate Position Helper Function
// const rigPosition = (
//   name,
//   position = { x: 0, y: 0, z: 0 },
//   dampener = 1,
//   lerpAmount = 0.3
// ) => {
//   if (!currentVrm) {return}
//   const Part = currentVrm.humanoid.getBoneNode(
//     THREE.VRMSchema.HumanoidBoneName[name]
//   );
//   if (!Part) {return}
//   let vector = new THREE.Vector3(
//     position.x * dampener,
//     position.y * dampener,
//     position.z * dampener
//   );
//   Part.position.lerp(vector, lerpAmount); // interpolate
// };

// let oldLookTarget = new THREE.Euler()
// const rigFace = (riggedFace) => {
//     if(!currentVrm){return}
//     rigRotation("Neck", riggedFace.head, 0.7);

//     // Blendshapes and Preset Name Schema
//     const Blendshape = currentVrm.blendShapeProxy;
//     const PresetName = THREE.VRMSchema.BlendShapePresetName;
  
//     // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
//     // for VRM, 1 is closed, 0 is open.
//     riggedFace.eye.l = lerp(clamp(1 - riggedFace.eye.l, 0, 1),Blendshape.getValue(PresetName.Blink), .5)
//     riggedFace.eye.r = lerp(clamp(1 - riggedFace.eye.r, 0, 1),Blendshape.getValue(PresetName.Blink), .5)
//     riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye,riggedFace.head.y)
//     Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);
    
//     // Interpolate and set mouth blendshapes
//     Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I,Blendshape.getValue(PresetName.I), .5));
//     Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A,Blendshape.getValue(PresetName.A), .5));
//     Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E,Blendshape.getValue(PresetName.E), .5));
//     Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O,Blendshape.getValue(PresetName.O), .5));
//     Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U,Blendshape.getValue(PresetName.U), .5));

//     //PUPILS
//     //interpolate pupil and keep a copy of the value
//     let lookTarget =
//       new THREE.Euler(
//         lerp(oldLookTarget.x , riggedFace.pupil.y, .4),
//         lerp(oldLookTarget.y, riggedFace.pupil.x, .4),
//         0,
//         "XYZ"
//       )
//     oldLookTarget.copy(lookTarget)
//     currentVrm.lookAt.applyer.lookAt(lookTarget);
// }

// /* VRM Character Animator */
// const animateVRM = (vrm, results) => {
//   if (!vrm) {
//     return;
//   }   

//   // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
//   let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

//   const faceLandmarks = results.faceLandmarks;
//   // Pose 3D Landmarks are with respect to Hip distance in meters
//   const pose3DLandmarks = results.ea;
//   // Pose 2D landmarks are with respect to videoWidth and videoHeight
//   const pose2DLandmarks = results.poseLandmarks;
//   // Be careful, hand landmarks may be reversed
//   const leftHandLandmarks = results.rightHandLandmarks;
//   const rightHandLandmarks = results.leftHandLandmarks;

//   // Animate Face
//   if (faceLandmarks) {
//    riggedFace = Kalidokit.Face.solve(faceLandmarks,{
//       runtime:"mediapipe",
//       video:videoElement
//    });
//    rigFace(riggedFace)
//   }

//   // Animate Pose
//   if (pose2DLandmarks && pose3DLandmarks) {
//     riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
//       runtime: "mediapipe",
//       video:videoElement,
//     });
//     rigRotation("Hips", riggedPose.Hips.rotation, 0.7);
//     // rigPosition(
//     //   "Hips",
//     //   {
//     //     x: -riggedPose.Hips.position.x, // Reverse direction
//     //     y: riggedPose.Hips.position.y, // Add a bit of height
//     //     z: -riggedPose.Hips.position.z// Reverse direction
//     //   },
//     //   1,
//     //   0.07
//     // );

//     rigRotation("Chest", riggedPose.Spine, 0.25, .3);
//     rigRotation("Spine", riggedPose.Spine, 0.45, .3);

//     rigRotation("RightUpperArm", riggedPose.RightUpperArm, 1, .3);
//     rigRotation("RightLowerArm", riggedPose.RightLowerArm, 1, .3);
//     rigRotation("LeftUpperArm", riggedPose.LeftUpperArm, 1, .3);
//     rigRotation("LeftLowerArm", riggedPose.LeftLowerArm, 1, .3);

//     rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg, 1, .3);
//     rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg, 1, .3);
//     rigRotation("RightUpperLeg", riggedPose.RightUpperLeg, 1, .3);
//     rigRotation("RightLowerLeg", riggedPose.RightLowerLeg, 1, .3);
//   }

//   // Animate Hands
//   if (leftHandLandmarks) {
//     riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
//     rigRotation("LeftHand", {
//       // Combine pose rotation Z and hand rotation X Y
//       z: riggedPose.LeftHand.z,
//       y: riggedLeftHand.LeftWrist.y,
//       x: riggedLeftHand.LeftWrist.x
//     });
//     rigRotation("LeftRingProximal", riggedLeftHand.LeftRingProximal);
//     rigRotation("LeftRingIntermediate", riggedLeftHand.LeftRingIntermediate);
//     rigRotation("LeftRingDistal", riggedLeftHand.LeftRingDistal);
//     rigRotation("LeftIndexProximal", riggedLeftHand.LeftIndexProximal);
//     rigRotation("LeftIndexIntermediate", riggedLeftHand.LeftIndexIntermediate);
//     rigRotation("LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
//     rigRotation("LeftMiddleProximal", riggedLeftHand.LeftMiddleProximal);
//     rigRotation("LeftMiddleIntermediate", riggedLeftHand.LeftMiddleIntermediate);
//     rigRotation("LeftMiddleDistal", riggedLeftHand.LeftMiddleDistal);
//     rigRotation("LeftThumbProximal", riggedLeftHand.LeftThumbProximal);
//     rigRotation("LeftThumbIntermediate", riggedLeftHand.LeftThumbIntermediate);
//     rigRotation("LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
//     rigRotation("LeftLittleProximal", riggedLeftHand.LeftLittleProximal);
//     rigRotation("LeftLittleIntermediate", riggedLeftHand.LeftLittleIntermediate);
//     rigRotation("LeftLittleDistal", riggedLeftHand.LeftLittleDistal);
//   }
//   if (rightHandLandmarks) {
//     riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
//     rigRotation("RightHand", {
//       // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
//       z: riggedPose.RightHand.z,
//       y: riggedRightHand.RightWrist.y,
//       x: riggedRightHand.RightWrist.x
//     });
//     rigRotation("RightRingProximal", riggedRightHand.RightRingProximal);
//     rigRotation("RightRingIntermediate", riggedRightHand.RightRingIntermediate);
//     rigRotation("RightRingDistal", riggedRightHand.RightRingDistal);
//     rigRotation("RightIndexProximal", riggedRightHand.RightIndexProximal);
//     rigRotation("RightIndexIntermediate",riggedRightHand.RightIndexIntermediate);
//     rigRotation("RightIndexDistal", riggedRightHand.RightIndexDistal);
//     rigRotation("RightMiddleProximal", riggedRightHand.RightMiddleProximal);
//     rigRotation("RightMiddleIntermediate", riggedRightHand.RightMiddleIntermediate);
//     rigRotation("RightMiddleDistal", riggedRightHand.RightMiddleDistal);
//     rigRotation("RightThumbProximal", riggedRightHand.RightThumbProximal);
//     rigRotation("RightThumbIntermediate", riggedRightHand.RightThumbIntermediate);
//     rigRotation("RightThumbDistal", riggedRightHand.RightThumbDistal);
//     rigRotation("RightLittleProximal", riggedRightHand.RightLittleProximal);
//     rigRotation("RightLittleIntermediate", riggedRightHand.RightLittleIntermediate);
//     rigRotation("RightLittleDistal", riggedRightHand.RightLittleDistal);
//   }
// };

// /* SETUP MEDIAPIPE HOLISTIC INSTANCE */
// let videoElement = document.querySelector(".input_video"),
//     guideCanvas = document.querySelector('canvas.guides');

// const onResults = (results) => {
//   // Draw landmark guides
//   drawResults(results)
//   // Animate model
//   animateVRM(currentVrm, results);
// }

// const holistic = new Holistic({
//     locateFile: file => {
//       return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
//     }
//   });

//   holistic.setOptions({
//     modelComplexity: 1,
//     smoothLandmarks: true,
//     minDetectionConfidence: 0.7,
//     minTrackingConfidence: 0.7,
//     refineFaceLandmarks: true,
//   });
//   // Pass holistic a callback function
//   holistic.onResults(onResults);

// const drawResults = (results) => {
//   guideCanvas.width = videoElement.videoWidth;
//   guideCanvas.height = videoElement.videoHeight;
//   let canvasCtx = guideCanvas.getContext('2d');
//   canvasCtx.save();
//   canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
//   // Use `Mediapipe` drawing functions
//   drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
//       color: "#00cff7",
//       lineWidth: 4
//     });
//     drawLandmarks(canvasCtx, results.poseLandmarks, {
//       color: "#ff0364",
//       lineWidth: 2
//     });
//     drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
//       color: "#C0C0C070",
//       lineWidth: 1
//     });
//     if(results.faceLandmarks && results.faceLandmarks.length === 478){
//       //draw pupils
//       drawLandmarks(canvasCtx, [results.faceLandmarks[468],results.faceLandmarks[468+5]], {
//         color: "#ffe603",
//         lineWidth: 2
//       });
//     }
//     drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
//       color: "#eb1064",
//       lineWidth: 5
//     });
//     drawLandmarks(canvasCtx, results.leftHandLandmarks, {
//       color: "#00cff7",
//       lineWidth: 2
//     });
//     drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
//       color: "#22c3e3",
//       lineWidth: 5
//     });
//     drawLandmarks(canvasCtx, results.rightHandLandmarks, {
//       color: "#ff0364",
//       lineWidth: 2
//     });
// }

// // Use `Mediapipe` utils to get camera - lower resolution = higher fps
// const camera = new Camera(videoElement, {
//   onFrame: async () => {
//     await holistic.send({image: videoElement});
//   },
//   width: 640,
//   height: 480
// });
// camera.start();


// // src/main.js : ver 1 - working

// // Imports (ESM)
// import * as THREE from 'three';
// // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { VRM, VRMUtils, VRMLoaderPlugin, VRMHumanBoneName } from '@pixiv/three-vrm';
// import { VRMAnimationLoaderPlugin, VRMAnimation, createVRMAnimationClip, VRMLookAtQuaternionProxy } from '@pixiv/three-vrm-animation';
// import { createOrbitRig } from './camera.js';

// // Global
// let currentVrm;
// let mixer;
// let idleAction;
// let isIdlePlaying = false;
// const clock = new THREE.Clock();

// // ADDED: VRMA state
// let vrmaClip = null;
// let vrmaAction = null;
// let isVRMAPlaying = false;

// // Renderer
// const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
// renderer.setSize(window.innerWidth-20, window.innerHeight-20);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// document.body.appendChild(renderer.domElement);

// // Scene
// const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper(100));

// // Camera
// const { orbitCamera, orbitControls } = createOrbitRig(renderer);

// // Light
// const ambientLight = new THREE.AmbientLight(0xffffff);
// ambientLight.position.set(0,0,0).normalize();
// scene.add(ambientLight);

// // Handle resize
// window.addEventListener('resize', () => {
//   orbitCamera.aspect = window.innerWidth / window.innerHeight;
//   orbitCamera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Background image (served from /public)
// const textureLoader = new THREE.TextureLoader();
// textureLoader.load(
//   '/austin.png',
//   (bg) => {
//     const aspect = bg.image.width / bg.image.height;
//     const mesh = new THREE.Mesh(
//       new THREE.PlaneGeometry(50, 50),
//       new THREE.MeshBasicMaterial({ map: bg })
//     );
//     mesh.scale.set(aspect, 0.5, 0.5);
//     mesh.rotation.y = -Math.PI/2;
//     mesh.position.set(100.0, 0.0, 0.0);
//     scene.add(mesh);
//   },
//   undefined,
//   (err) => console.error('Failed to load background:', err)
// );

// // VRM load (from /public)
// const gltfLoader = new GLTFLoader();

// // Enable VRM parsing on GLTFLoader
// gltfLoader.register((parser) => new VRMLoaderPlugin(parser));

// // ADDED: enable VRMA parsing on the same GLTFLoader
// gltfLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));

// gltfLoader.crossOrigin = 'anonymous';

// gltfLoader.load(
//   '/delete.vrm',
//   (gltf) => {
//     const vrm = gltf.userData.vrm;
//     VRMUtils.combineSkeletons(vrm.scene);
//     scene.add(vrm.scene);
//     currentVrm = vrm;

//     currentVrm.scene.rotation.y = Math.PI/2;
//     currentVrm.scene.position.set(20.0,0.0,0.0);

//     const hips =
//       vrm.humanoid?.getRawBoneNode?.(VRMHumanBoneName.Hips) ||
//       vrm.humanoid?.getBoneNode?.('hips');
//     if (hips) hips.add(new THREE.AxesHelper(100));

//     const skeletonHelper = new THREE.SkeletonHelper(vrm.scene);
//     skeletonHelper.visible = true; // make sure it’s on
//     scene.add(skeletonHelper);

//     // Store for later updates (optional)
//     vrm.skeletonHelper = skeletonHelper;

//     // ADDED: load a VRMA once the VRM is ready
//     loadVRMA('/a.vrma'); // <-- change path to your VRMA
//   },
//   (progress) => {
//     const pct = progress.total ? (100 * progress.loaded / progress.total).toFixed(1) : '…';
//     console.log('Loading model…', pct, '%');
//   },
//   (error) => console.error('VRM load error:', error)
// );

// let idleClip;

// // Existing: load a glTF with animation to retarget to VRM
// gltfLoader.load('/flipped.glb', (gltf) => {
//   idleClip = gltf.animations[1];
// });

// // --- Retargeting utilities (unchanged) ---
// function retargetClipToVRM(clip, vrm) {
//   const mapped = clip.clone();

//   const quickMap = {
//     hips: VRMHumanBoneName.Hips,
//     spine: VRMHumanBoneName.Spine,
//     chest: VRMHumanBoneName.Chest,
//     neck: VRMHumanBoneName.Neck,
//     head: VRMHumanBoneName.Head,
//     leftshoulder: VRMHumanBoneName.LeftShoulder,
//     leftupperarm: VRMHumanBoneName.LeftUpperArm,
//     leftlowerarm: VRMHumanBoneName.LeftLowerArm,
//     lefthand: VRMHumanBoneName.LeftHand,
//     rightshoulder: VRMHumanBoneName.RightShoulder,
//     rightupperarm: VRMHumanBoneName.RightUpperArm,
//     rightlowerarm: VRMHumanBoneName.RightLowerArm,
//     righthand: VRMHumanBoneName.RightHand,
//     leftupperleg: VRMHumanBoneName.LeftUpperLeg,
//     leftlowerleg: VRMHumanBoneName.LeftLowerLeg,
//     leftfoot: VRMHumanBoneName.LeftFoot,
//     rightupperleg: VRMHumanBoneName.RightUpperLeg,
//     rightlowerleg: VRMHumanBoneName.RightLowerLeg,
//     rightfoot: VRMHumanBoneName.RightFoot,
//   };

//   mapped.tracks = mapped.tracks.map((t) => {
//     const [rawNode, prop] = t.name.split('.');
//     const rawLC = rawNode.toLowerCase();

//     let targetNode = rawNode; // fallback
//     for (const key in quickMap) {
//       if (rawLC.includes(key)) {
//         const node = vrm.humanoid?.getRawBoneNode(quickMap[key]);
//         if (node) targetNode = node.name;
//         break;
//       }
//     }

//     t.name = `${targetNode}.${prop}`;
//     return t;
//   });

//   return mapped;
// }

// // --- Existing idle animation controls (glTF-retargeted) ---
// function playIdleAnimation() {
//   console.log("HIT: play animation");
//   if (!currentVrm || !idleClip) return;
//   if (!mixer) mixer = new THREE.AnimationMixer(currentVrm.scene);

//   const clip = retargetClipToVRM(idleClip, currentVrm);
//   clip.loop = THREE.LoopRepeat;

//   const action = mixer.clipAction(clip);

//   // ADDED: if VRMA is playing, crossfade out
//   if (vrmaAction && isVRMAPlaying) {
//     vrmaAction.crossFadeTo(action, 0.3, false);
//     isVRMAPlaying = false;
//   }

//   if (idleAction && idleAction !== action) {
//     idleAction.crossFadeTo(action, 0.3, false);
//   }
//   idleAction = action;
//   idleAction.reset().fadeIn(0.25).play();
//   isIdlePlaying = true;
// }

// function stopIdleAnimation() {
//   if (idleAction) {
//     idleAction.fadeOut(0.25);
//     setTimeout(() => idleAction.stop(), 300);
//   }
//   isIdlePlaying = false;
// }

// function toggleIdleAnimation() {
//   console.log("HIT: toggle");
//   if (isIdlePlaying) stopIdleAnimation();
//   else playIdleAnimation();
// }

// const vrmaLoader = new GLTFLoader();
// vrmaLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));
// vrmaLoader.crossOrigin = 'anonymous';

// function loadVRMA(path) {
//   if (!currentVrm) return;

// // Inside your VRMA loading callback
//   vrmaLoader.load(
//     '/pleasework.vrma',
//     (gltf) => {
//       const vrmAnim = gltf.userData?.vrmAnimations?.[0];
//       if (vrmAnim) {
//         console.log('[VRMA LOADED] Found VRMAnimation');
        
//         // Create the animation clip
//         vrmaClip = createVRMAnimationClip(vrmAnim, currentVrm);
//         console.log('✅ VRMA animation clip created');
//       } else {
//         console.error('❌ No VRMAnimation found in the loaded VRMA');
//       }
//     },
//     undefined,
//     (err) => console.error('VRMA load error:', err)
//   );
// }




// function playVRMA() {
//   if (!currentVrm || !vrmaClip) {
//     console.warn('VRMA not ready yet.');
//     return;
//   }
//   if (!mixer) mixer = new THREE.AnimationMixer(currentVrm.scene);

//   const action = mixer.clipAction(vrmaClip);

//   // Crossfade out idle if needed
//   if (idleAction && isIdlePlaying) {
//     idleAction.crossFadeTo(action, 0.3, false);
//     isIdlePlaying = false;
//   }

//   if (vrmaAction && vrmaAction !== action) {
//     vrmaAction.crossFadeTo(action, 0.3, false);
//   }
//   vrmaAction = action;
//   vrmaAction.reset().fadeIn(0.25).play();
//   isVRMAPlaying = true;
// }

// function stopVRMA() {
//   if (vrmaAction) {
//     vrmaAction.fadeOut(0.25);
//     setTimeout(() => vrmaAction.stop(), 300);
//   }
//   isVRMAPlaying = false;
// }

// function toggleVRMA() {
//   if (isVRMAPlaying) stopVRMA();
//   else playVRMA();
// }

// // Safe: wait for DOM, then hook up the buttons
// document.addEventListener('DOMContentLoaded', () => {
//   const btn = document.getElementById('toggleIdle');
//   if (btn) btn.addEventListener('click', toggleVRMA); //toggleIdleAnimation

//   // ADDED: optional button for VRMA (add <button id="playVRMA">Play VRMA</button> in your HTML)
//   const btnVRMA = document.getElementById('playVRMA');
//   if (btnVRMA) btnVRMA.addEventListener('click', toggleVRMA);
// });

// function animate() {
//   requestAnimationFrame(animate);
//   const delta = clock.getDelta();

//   if (currentVrm) {
//     // VRM 1.x needs update for spring bones / lookAt, etc.
//     currentVrm.update(delta);
//   }
//   if (mixer) mixer.update(delta);

//   // Use the orbit camera you created
//   renderer.render(scene, orbitCamera);
// }
// animate();
