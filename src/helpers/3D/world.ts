import { createCamera } from '@/helpers/3D/camera';
import { createLights } from '@/helpers/3D/lights';
import { createScene } from '@/helpers/3D/scene';
import { createRenderer } from '@/helpers/3D/renderer';
import { Loop } from '@/helpers/3D/loop';
import { Resizer } from '@/helpers/3D/resizer';

// These variables are module-scoped: we cannot access them
// from outside the module.
let camera;
let renderer;
let scene;
let loop;

export class World {
  constructor(container) {
    // Instances of camera, scene, and renderer
    camera = createCamera();
    scene = createScene('blue');
    renderer = createRenderer();
    // Initialize Loop
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    // Light Instance, with optional light helper
    const { light, lightHelper } = createLights('white');
    loop.updatables.push(light);
    scene.add(light);

    const resizer = new Resizer(container, camera, renderer);
    resizer.onResize = () => {
      this.render();
    };
  }
  render() {
    // Draw a single frame
    renderer.render(scene, camera);
  }
  // Animation handlers
  start() {
    loop.start();
  }
  stop() {
    loop.stop();
  }
}
