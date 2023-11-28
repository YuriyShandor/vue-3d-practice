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
  Mesh
} from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { onMounted, onUnmounted } from 'vue';

const scene = new Scene();
scene.background = null;
const camera = new PerspectiveCamera(33, 1, 0.1, 10);
camera.position.z = 5;

const renderer = new WebGLRenderer({ alpha: true });

const geometry = new BoxGeometry(1, 1, 1);
for (var i = 0; i < geometry.faces.length; i++) {
  geometry.faces[i].color.setHex(Math.random() * 0xffffff);
}
const material = new MeshBasicMaterial({ color: 0xd50000, vertexColors: true });
const cube = new Mesh(geometry, material);
scene.add(cube);

let sceneContainer: HTMLElement | null = null;

const renderScene = () => {
  if (sceneContainer !== null) {
    sceneContainer.appendChild(renderer.domElement);
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
  animate();

  window.addEventListener('resize', resizeScene);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeScene);
});
</script>
