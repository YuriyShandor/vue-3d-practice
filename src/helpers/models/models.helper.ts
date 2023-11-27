import { createScene } from './components/scene';
import { createCamera } from './components/camera';
import { createRenderer } from './components/renderer';
import { createLights } from './components/lights';
import { createControls } from './components/controls';
import { Loop } from './components/loop';
import { Resizer } from './components/resizer';

import { loadBirds } from './components/birds/birds';

let camera: any;
let controls: any;
let renderer: any;
let scene: any;
let loop: any;

class ModelsHelper {
  constructor(container: any) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);

    const { ambientLight, mainLight } = createLights();

    loop.updatables.push(controls);
    scene.add(ambientLight, mainLight);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    const { parrot, flamingo, stork } = await loadBirds();

    // move the target to the center of the front bird
    controls.target.copy(parrot.position);

    scene.add(parrot, flamingo, stork);
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export default ModelsHelper;
