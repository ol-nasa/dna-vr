import * as THREE from "three";

export class Controls{

    constructor(world){

        this.world = world;

        this.camera = world.camera;

        this.keys = {};

        this.speed = 0.08;

        this.vrSpeed = 0.06;

        this.turnSpeed = 0.03;


        // клавиатура

        document.addEventListener(

            "keydown",

            e=>this.keys[e.code]=true

        );


        document.addEventListener(

            "keyup",

            e=>this.keys[e.code]=false

        );


        // мышь

        document.body.onclick=()=>{

            document.body.requestPointerLock();

        };


        document.addEventListener(

            "mousemove",

            e=>{

                if(document.pointerLockElement){

                    this.camera.rotation.order="YXZ";


                    this.camera.rotation.y-=

                        e.movementX*0.002;


                    this.camera.rotation.x-=

                        e.movementY*0.002;


                    this.camera.rotation.x=Math.max(

                        -Math.PI/2,

                        Math.min(

                            Math.PI/2,

                            this.camera.rotation.x

                        )

                    );

                }

            }

        );


        // VR контроллеры

        this.setupVR();

    }



    setupVR(){

        const renderer=this.world.renderer;

        if(!renderer.xr) return;


        this.world.controller1 =

            renderer.xr.getController(0);


        this.world.controller2 =

            renderer.xr.getController(1);



        this.world.scene.add(

            this.world.controller1

        );


        this.world.scene.add(

            this.world.controller2

        );


        this.world.controller1.addEventListener(

            "selectstart",

            ()=>{

                this.world.vrSelect=true;

            }

        );


        this.world.controller1.addEventListener(

            "selectend",

            ()=>{

                this.world.vrSelect=false;

            }

        );


        this.world.controller2.addEventListener(

            "selectstart",

            ()=>{

                this.world.vrSelect=true;

            }

        );


        this.world.controller2.addEventListener(

            "selectend",

            ()=>{

                this.world.vrSelect=false;

            }

        );

    }



    update(){


        // обычное движение

        const dir=new THREE.Vector3();

        this.camera.getWorldDirection(dir);

        dir.y=0;

        dir.normalize();



        const right=new THREE.Vector3();

        right.crossVectors(

            dir,

            new THREE.Vector3(0,1,0)

        );



        if(this.keys["KeyW"])

            this.camera.position.addScaledVector(

                dir,

                this.speed

            );


        if(this.keys["KeyS"])

            this.camera.position.addScaledVector(

                dir,

                -this.speed

            );


        if(this.keys["KeyA"])

            this.camera.position.addScaledVector(

                right,

                this.speed

            );


        if(this.keys["KeyD"])

            this.camera.position.addScaledVector(

                right,

                -this.speed

            );



        this.updateVR();

    }





    updateVR(){


        if(!this.world.renderer.xr.isPresenting)

            return;



        const controller=

            this.world.controller1;


        if(!controller)

            return;


        const gamepad=

            controller.gamepad;


        if(!gamepad)

            return;



        if(gamepad.axes.length<2)

            return;



        // разные VR контроллеры имеют разные оси

        const moveX=

            gamepad.axes[2] ?? gamepad.axes[0];


        const moveY=

            gamepad.axes[3] ?? gamepad.axes[1];



        const lookX=

            gamepad.axes[0];



        const dir=new THREE.Vector3();

        this.camera.getWorldDirection(dir);

        dir.y=0;

        dir.normalize();



        const right=new THREE.Vector3();

        right.crossVectors(

            dir,

            new THREE.Vector3(0,1,0)

        );



        // движение левым стиком

        this.camera.position.addScaledVector(

            dir,

            -moveY*this.vrSpeed

        );


        this.camera.position.addScaledVector(

            right,

            moveX*this.vrSpeed

        );



        // поворот правым стиком

        if(Math.abs(lookX)>0.1){


            this.camera.rotation.y-=

                lookX*this.turnSpeed;


        }


    }

}
