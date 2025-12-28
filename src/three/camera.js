// cameraRig.js
import { PerspectiveCamera, MathUtils } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createOrbitRig(renderer) {
    const camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);

    const controls = new OrbitControls(camera, renderer.domElement);

    return { orbitCamera: camera, orbitControls: controls };
}
    // // manual camera movement
    // controls.enableZoom = false;
    // controls.enablePan = false;
    // controls.rotateSpeed = 0.05;
    // controls.rotateSpeed = 1;
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;

    // Initial view
    // controls.target.set(20, 0, 0);
    // controls.update();

    // Tight rotation limits around the current view
    // const basePolar   = controls.getPolarAngle();
    // const baseAzimuth = controls.getAzimuthalAngle();
    // const polarEps = MathUtils.degToRad(1);  // ±1°
    // const azimEps  = MathUtils.degToRad(3);  // ±3°

    // controls.minPolarAngle = basePolar - polarEps;
    // controls.maxPolarAngle = basePolar + polarEps;
    // controls.minAzimuthAngle = baseAzimuth - azimEps;
    // controls.maxAzimuthAngle = baseAzimuth + azimEps;
