<template>
  <div class="w-full">
    <div class="container">
      <div class="flex items-center justify-center">
        <div class="w-screen h-screen" id="model-scene-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
let mesh: any;
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = new THREE.Color(0xeff5555);
scene.add(new THREE.HemisphereLight(0xffffcc, 0x333399, 1.0));
camera.position.set(5, 30, 10);

new GLTFLoader().load('./models/maple_leaf.glb', ({ scene: model }, animations) => {
  scene.add(model);

  // model.scale.setScalar(2.0);

  camera.lookAt(model.position);

  controls.target.copy(model.position);

  mesh = model;
});

const animate = () => {
  if (mesh) {
    mesh.rotateY(Math.PI / 360);
  }

  renderer.render(scene, camera);

  controls.update();

  requestAnimationFrame(animate);
};

animate();

document.body.appendChild(renderer.domElement);

onMounted(() => {
  const sceneContainer = document.querySelector('#model-scene-container');
  if (sceneContainer !== null) {
    sceneContainer.appendChild(renderer.domElement);
  }
});
</script>
