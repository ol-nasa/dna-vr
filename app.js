import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ----------------------------------------------------
// Scene
// ----------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 80, 250);

// ----------------------------------------------------
// Camera
// ----------------------------------------------------

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.set(0, 10, 20);

// ----------------------------------------------------
// Renderer
// ----------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("canvas").appendChild(renderer.domElement);

// ----------------------------------------------------
// Controls
// ----------------------------------------------------

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.target.set(0, 0, 0);

// ----------------------------------------------------
// Lights
// ----------------------------------------------------

scene.add(new THREE.AmbientLight(0xffffff, 0.8));

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(30, 80, 40);

scene.add(sun);

// ----------------------------------------------------
// Grid
// ----------------------------------------------------

const grid = new THREE.GridHelper(
    200,
    200,
    0x444444,
    0x222222
);

scene.add(grid);

// ----------------------------------------------------
// Ground
// ----------------------------------------------------

const ground = new THREE.Mesh(

    new THREE.PlaneGeometry(300,300),

    new THREE.MeshStandardMaterial({

        color:0x111111,
        roughness:1

    })

);

ground.rotation.x = -Math.PI/2;

scene.add(ground);

// ----------------------------------------------------
// Test cubes
// ----------------------------------------------------

const material = new THREE.MeshStandardMaterial({

    roughness:0.7,
    metalness:0.1

});

for(let z=0; z<25; z++){

    for(let x=0; x<25; x++){

        const g = Math.floor(Math.random()*255);

        material.color.setRGB(g/255,g/255,g/255);

        const cube = new THREE.Mesh(

            new THREE.BoxGeometry(0.8,0.8,0.8),

            material.clone()

        );

        cube.position.set(

            x-12,

            0.4,

            z-12

        );

        scene.add(cube);

    }

}

// ----------------------------------------------------
// Status
// ----------------------------------------------------

document.getElementById("status").textContent =
"Тестовая сцена готова.";

// ----------------------------------------------------
// Resize
// ----------------------------------------------------

window.addEventListener("resize",()=>{

    camera.aspect =
        window.innerWidth/window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// ----------------------------------------------------
// Animation
// ----------------------------------------------------

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();
