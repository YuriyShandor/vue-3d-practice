<template>
  <div class="w-full">
    <div class="container">
      <div class="w-full h-screen flex items-center justify-center">
        <div class="w-full max-w-[100vh] h-screen max-h-[100vw]" id="leaf-scene-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight } from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new Scene();
scene.background = null;
scene.add(new HemisphereLight(0xffffff, 0xffffff, 1.0));
const camera = new PerspectiveCamera(33, 1, 0.1, 1000);
camera.position.set(13, 3, 3);
// camera.position.z = 15;
// camera.lookAt(scene.position);

const renderer = new WebGLRenderer({ alpha: true });

const controls = new OrbitControls(camera, renderer.domElement);

let mesh: any;

let sceneContainer: HTMLElement | null = null;

const loadModel = () => {
  new GLTFLoader().load('./models/cube.glb', (gltf) => {
    scene.add(gltf.scene);

    // gltf.scene.position.x = 13;
    // gltf.scene.position.y = 73;
    // gltf.scene.position.z = 13;

    // console.log(gltf);

    camera.lookAt(gltf.scene.position);

    controls.target.copy(gltf.scene.position);

    mesh = gltf.scene;
  });
};

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
  // if (mesh) {
  //   mesh.rotateY(Math.PI / 360);
  // }

  renderer.render(scene, camera);

  controls.update();

  requestAnimationFrame(animate);
}

onMounted(() => {
  sceneContainer = document.querySelector('#leaf-scene-container');

  loadModel();
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
