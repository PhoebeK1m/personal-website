import * as THREE from 'three';

export function loadSky(scene){
    const rows = 4, cols = 1, order = [0,1,2,3,2,1];
    const tex = new THREE.TextureLoader().load('/theater/background/sky.png', () => {
        tex.minFilter = THREE.NearestFilter;
        tex.magFilter = THREE.NearestFilter;
        tex.generateMipmaps = false;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.repeat.set(1, 1 / rows);
    });

    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), mat);
    quad.rotation.y = -Math.PI / 2;
    quad.position.set(30,-1,0);
    scene.add(quad);

    const fps = 4;
    let acc = 0, i = 0;

    function tick(dt) {
        acc += dt;
        const step = 1 / fps;
        while (acc >= step) {
            acc -= step;
            i = (i + 1) % order.length;
            const row = order[i];
            tex.offset.set(0, 1 - (row + 1) / rows);
        }
    }
    return { tick };
}