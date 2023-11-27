import { PerspectiveCamera } from 'three';

export const createCamera = () => {
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);

  camera.position.set(-2, 2, 10);

  return camera;
};
