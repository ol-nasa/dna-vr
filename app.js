import {World} from "./world.js";
import {Controls} from "./controls.js";

const world = new World();

const controls = new Controls(world);

world.setControls(controls);

world.renderer.setAnimationLoop(() => {

    controls.update();

    world.update();

    world.render();

});
