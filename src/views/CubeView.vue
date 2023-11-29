<template>
  <div class="w-full">
    <div class="container">
      <div class="w-full h-screen flex items-center justify-center">
        <div class="w-full max-w-[100vh] h-screen max-h-[100vw]" id="cube-scene-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Color,
  Mesh,
  Float32BufferAttribute
} from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, onUnmounted } from 'vue';

const scene = new Scene();
scene.background = null;
const camera = new PerspectiveCamera(33, 1, 0.1, 10);
camera.position.z = 5;

const renderer = new WebGLRenderer({ alpha: true });

const piece = new BoxGeometry(1, 1, 1).toNonIndexed();
const material = new MeshBasicMaterial({
  vertexColors: true
});
const positionAttribute = piece.getAttribute('position');
const colors = [];
const color = new Color();
for (let i = 0; i < positionAttribute.count; i += 6) {
  color.setHex(0x500000 * Math.random());
  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
}
piece.setAttribute('color', new Float32BufferAttribute(colors, 3));
const cube = new Mesh(piece, material);
scene.add(cube);

let sceneContainer: HTMLElement | null = null;

const controls = new OrbitControls(camera, renderer.domElement);

const renderScene = () => {
  if (sceneContainer !== null) {
    sceneContainer.appendChild(renderer.domElement);
    controls.update();
  }
};

const resizeScene = () => {
  if (sceneContainer !== null) {
    sceneContainer.style.height = `${sceneContainer.clientWidth}px`;
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
  }
};

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.005;
  cube.rotation.y += 0.003;

  renderer.render(scene, camera);
}

onMounted(() => {
  sceneContainer = document.querySelector('#cube-scene-container');

  resizeScene();
  renderScene();

  if (WebGL.isWebGLAvailable()) {
    animate();
  } else {
    console.log(WebGL.getWebGLErrorMessage());
  }

  window.addEventListener('resize', resizeScene);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeScene);
});
</script>
