import {World} from "./world.js";
import {Controls} from "./controls.js";

import {VRButton} from "three/addons/webxr/VRButton.js";


const world = new World();


document.body.appendChild(

    VRButton.createButton(world.renderer)

);


const controls = new Controls(world);


world.setControls = function(controls){

    this.controls = controls;

};


world.setControls(controls);



world.renderer.setAnimationLoop(()=>{

    controls.update();

    world.update();

    world.render();

});
