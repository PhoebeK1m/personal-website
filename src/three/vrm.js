import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMUtils } from '@pixiv/three-vrm';

export function loadVRMModel(scene, gltfLoader, modelUrl) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            modelUrl,
            (gltf) => {
                const vrm = gltf.userData.vrm;
                VRMUtils.combineSkeletons(vrm.scene);
                scene.add(vrm.scene);
                vrm.scene.rotation.y = -Math.PI / 2;
                vrm.scene.position.set(20.0, -0.55, 0.0);
                resolve(vrm);  // Resolve with the VRM model when loaded
            },
            (progress) => {
                const pct = progress.total ? (100 * progress.loaded / progress.total).toFixed(1) : '…';
                console.log('Loading model…', pct, '%');
            },
            (error) => reject(error)  // Reject the Promise in case of an error
        );
    });
}


