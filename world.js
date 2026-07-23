import * as THREE from "three";

import {VRButton}
from "three/addons/webxr/VRButton.js";

import {XRControllerModelFactory}
from "three/addons/webxr/XRControllerModelFactory.js";

export class World{

    constructor(){

        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(0x050505);

        this.camera = new THREE.PerspectiveCamera(

            70,
            window.innerWidth/window.innerHeight,
            0.1,
            5000

        );

        this.camera.position.set(0,2,8);

        this.renderer = new THREE.WebGLRenderer({

            antialias:true

        });

        this.renderer.setSize(

            window.innerWidth,
            window.innerHeight

        );

        document.body.appendChild(this.renderer.domElement);

        window.addEventListener("resize",()=>{

            this.camera.aspect =
                window.innerWidth/window.innerHeight;

            this.camera.updateProjectionMatrix();

            this.renderer.setSize(

                window.innerWidth,
                window.innerHeight

            );

        });

        this.createLights();

        this.createTestCube();

    }

    createLights(){

        const ambient =
            new THREE.AmbientLight(0xffffff,2);

        this.scene.add(ambient);

        const dir =
            new THREE.DirectionalLight(0xffffff,1);

        dir.position.set(5,10,8);

        this.scene.add(dir);

    }

    createTestCube(){

        const geo =
            new THREE.BoxGeometry();

        const mat =
            new THREE.MeshStandardMaterial({

                color:0x888888

            });

        const cube =
            new THREE.Mesh(geo,mat);

        this.scene.add(cube);

        this.testCube = cube;

    }

    update(){

        this.testCube.rotation.y+=0.003;

    }

    render(){

        this.renderer.render(

            this.scene,
            this.camera

        );

    }

}
