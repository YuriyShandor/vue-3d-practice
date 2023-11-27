import { PerspectiveCamera } from 'three';

export const createCamera = () => {
  const camera = new PerspectiveCamera(33, 1, 0.1, 10);

  camera.position.set(-1.5, 1.5, 6.5);

  return camera;
};
