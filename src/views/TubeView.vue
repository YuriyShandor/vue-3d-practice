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
import { onMounted, onUnmounted } from 'vue';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Curve,
  Vector3,
  TubeGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new Scene();
scene.background = null;
const camera = new PerspectiveCamera(50, 1, 0.1, 2000);
camera.position.z = 13;

const renderer = new WebGLRenderer({ alpha: true });
const controls = new OrbitControls(camera, renderer.domElement);

class CustomSinCurve extends Curve {
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t, optionalTarget = new Vector3()) {
    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

const path = new CustomSinCurve(1);
const geometry = new TubeGeometry(path, 64, 2, 8, false);
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new Mesh(geometry, material);
scene.add(mesh);

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
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.003;
  renderer.render(scene, camera);
  controls.update();
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
