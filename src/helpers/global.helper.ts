class GlobalHelper {
  renderScene(renderer: any, sceneContainer: (HTMLElement | null)) {
    if (sceneContainer !== null) {
      sceneContainer.appendChild(renderer.domElement);
    }
  }
}

export default new GlobalHelper()