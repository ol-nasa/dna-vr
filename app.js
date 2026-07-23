import {World} from "./world.js";

const world = new World();

function animate(){

    requestAnimationFrame(animate);

    world.update();

    world.render();

}

animate();
