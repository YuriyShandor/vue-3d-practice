import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const createControls = (camera: any, canvas: any) => {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;

  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();

  return controls;
};
