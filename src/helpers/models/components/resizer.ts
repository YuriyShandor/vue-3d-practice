const setSize = (container: any, camera: any, renderer: any) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

export class Resizer {
  constructor(container: any, camera: any, renderer: any) {
    // set initial size
    setSize(container, camera, renderer);

    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      setSize(container, camera, renderer);
      // perform any custom actions
      this.onResize();
    });
  }

  onResize() {}
}
