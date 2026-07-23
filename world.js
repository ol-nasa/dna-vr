import * as THREE from "three";


export class Controls{


    constructor(world){


        this.world=world;

        this.camera=world.camera;


        this.keys={};


        this.speed=0.08;

        this.vrSpeed=0.06;

        this.turnSpeed=0.04;


        this.vrSelect=false;


        document.addEventListener(

            "keydown",

            e=>this.keys[e.code]=true

        );


        document.addEventListener(

            "keyup",

            e=>this.keys[e.code]=false

        );



        document.body.onclick=()=>{

            if(document.pointerLockElement===null)

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



        this.setupVR();

    }





    setupVR(){


        if(!this.world.renderer)

            return;


        if(!this.world.renderer.xr)

            return;



        this.world.renderer.xr.enabled=true;



        this.world.controller1=

            this.world.renderer.xr.getController(0);



        this.world.controller2=

            this.world.renderer.xr.getController(1);



        if(this.world.scene){


            this.world.scene.add(

                this.world.controller1

            );


            this.world.scene.add(

                this.world.controller2

            );

        }



        this.world.controller1.addEventListener(

            "selectstart",

            ()=>{

                this.vrSelect=true;

            }

        );


        this.world.controller1.addEventListener(

            "selectend",

            ()=>{

                this.vrSelect=false;

            }

        );



        this.world.controller2.addEventListener(

            "selectstart",

            ()=>{

                this.vrSelect=true;

            }

        );


        this.world.controller2.addEventListener(

            "selectend",

            ()=>{

                this.vrSelect=false;

            }

        );


    }






    update(){



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



        if(!this.world.renderer.xr)

            return;



        if(!this.world.renderer.xr.isPresenting)

            return;



        const session=

            this.world.renderer.xr.getSession();



        if(!session)

            return;




        let left=null;

        let rightPad=null;



        for(const source of session.inputSources){



            if(!source.gamepad)

                continue;



            if(source.handedness==="left")

                left=source.gamepad;



            if(source.handedness==="right")

                rightPad=source.gamepad;


        }






        if(left){



            const x=

                left.axes[2] ?? 0;



            const y=

                left.axes[3] ?? 0;




            const dir=new THREE.Vector3();


            this.camera.getWorldDirection(dir);


            dir.y=0;


            dir.normalize();




            const side=new THREE.Vector3();


            side.crossVectors(

                dir,

                new THREE.Vector3(0,1,0)

            );



            this.camera.position.addScaledVector(

                dir,

                -y*this.vrSpeed

            );



            this.camera.position.addScaledVector(

                side,

                x*this.vrSpeed

            );


        }







        if(rightPad){



            const x=

                rightPad.axes[2] ?? 0;




            if(Math.abs(x)>0.7){



                this.camera.rotation.y-=

                    Math.sign(x)*this.turnSpeed;



            }


        }


    }


}
