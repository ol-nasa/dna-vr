import * as THREE from "three";


export class World{


    constructor(){


        this.scene = new THREE.Scene();


        this.scene.background =

            new THREE.Color(0x050505);



        this.camera = new THREE.PerspectiveCamera(

            70,

            window.innerWidth / window.innerHeight,

            0.1,

            5000

        );


        this.camera.position.set(

            0,

            1.6,

            0

        );



        this.renderer = new THREE.WebGLRenderer({

            antialias:true

        });



        this.renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );



        this.renderer.xr.enabled = true;



        document.body.appendChild(

            this.renderer.domElement

        );



        window.addEventListener(

            "resize",

            ()=>{


                this.camera.aspect =

                    window.innerWidth /

                    window.innerHeight;



                this.camera.updateProjectionMatrix();



                this.renderer.setSize(

                    window.innerWidth,

                    window.innerHeight

                );


            }

        );



        this.createLights();


        this.createFloor();


        this.createTestCube();


        this.createVRControllers();


    }






    createLights(){



        const ambient =

            new THREE.AmbientLight(

                0xffffff,

                2

            );


        this.scene.add(

            ambient

        );



        const dir =

            new THREE.DirectionalLight(

                0xffffff,

                1

            );


        dir.position.set(

            5,

            10,

            8

        );



        this.scene.add(

            dir

        );


    }







    createFloor(){



        const geo =

            new THREE.PlaneGeometry(

                20,

                20

            );



        const mat =

            new THREE.MeshStandardMaterial({

                color:0x202020

            });



        const floor =

            new THREE.Mesh(

                geo,

                mat

            );


        floor.rotation.x =

            -Math.PI/2;



        floor.position.y =

            0;



        this.scene.add(

            floor

        );


    }







    createTestCube(){



        const geo =

            new THREE.BoxGeometry(

                1.5,

                1.5,

                1.5

            );



        const mat =

            new THREE.MeshStandardMaterial({

                color:0x888888

            });



        this.testCube =

            new THREE.Mesh(

                geo,

                mat

            );



        this.testCube.position.set(

            0,

            1.5,

            -3

        );



        this.scene.add(

            this.testCube

        );


    }







    createVRControllers(){



        this.controller1 =

            this.renderer.xr.getController(0);



        this.controller2 =

            this.renderer.xr.getController(1);



        this.scene.add(

            this.controller1

        );



        this.scene.add(

            this.controller2

        );



        this.addRay(

            this.controller1

        );



        this.addRay(

            this.controller2

        );



        this.controller1.addEventListener(

            "selectstart",

            ()=>{

                this.checkHit();

            }

        );



        this.controller2.addEventListener(

            "selectstart",

            ()=>{

                this.checkHit();

            }

        );


    }







    addRay(controller){



        const geometry =

            new THREE.BufferGeometry();



        geometry.setFromPoints([

            new THREE.Vector3(0,0,0),

            new THREE.Vector3(0,0,-5)

        ]);



        const material =

            new THREE.LineBasicMaterial({

                color:0xffffff

            });



        const line =

            new THREE.Line(

                geometry,

                material

            );



        controller.add(

            line

        );


    }








    checkHit(){



        const raycaster =

            new THREE.Raycaster();



        const matrix =

            new THREE.Matrix4();




        for(const controller of [

            this.controller1,

            this.controller2

        ]){



            matrix.identity();



            matrix.extractRotation(

                controller.matrixWorld

            );



            const origin =

                new THREE.Vector3();



            origin.setFromMatrixPosition(

                controller.matrixWorld

            );



            const direction =

                new THREE.Vector3(

                    0,

                    0,

                    -1

                );



            direction.applyMatrix4(

                matrix

            );



            raycaster.set(

                origin,

                direction

            );



            const hit =

                raycaster.intersectObject(

                    this.testCube

                );



            if(hit.length){



                this.testCube.material.color.set(

                    Math.random()*0xffffff

                );



            }


        }


    }







    update(){



        this.testCube.rotation.y += 0.003;


    }






    render(){



        this.renderer.render(

            this.scene,

            this.camera

        );


    }


}
