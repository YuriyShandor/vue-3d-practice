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
import ModelsHelper from '@/helpers/models/models.helper';

// import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight } from 'three';
// import WebGL from 'three/addons/capabilities/WebGL.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { onMounted, onUnmounted } from 'vue';

// const scene = new Scene();
// scene.background = null;

// const camera = new PerspectiveCamera(33, 1, 0.1, 10);
// camera.position.z = 5;

// const renderer = new WebGLRenderer({ alpha: true });
// let light = new AmbientLight(0x404040);

// let loader = new GLTFLoader();

// const init = () => {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   loader.load(
//     '/3D-models/maple_leaf.glb',
//     function (glb) {
//       console.log(glb);
//       scene.add(glb.scene);
//       light.position.set(2, 2, 5);
//       scene.add(light);
//     },
//     function (xhr) {
//       console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
//     },
//     function (error) {
//       console.error(error);
//     }
//   );
//   // const controls = new OrbitControls(camera, renderer.domElement)
//   const container = document.getElementById('model-scene-container');
//   if (container !== null) {
//     container.appendChild(renderer.domElement);
//     camera.position.set(0, 1, 2);
//   }
// };

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xd50000, fog: false });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// let sceneContainer: HTMLElement | null = null;

// const renderScene = () => {
//   if (sceneContainer !== null) {
//     sceneContainer.appendChild(renderer.domElement);

//     loader.load(
//       '/3D-models/maple_leaf.glb',
//       function (gltf) {
//         scene.add(gltf.scene);
//       },
//       undefined,
//       function (error) {
//         console.error(error);
//       }
//     );
//   }
// };

// const resizeScene = () => {
//   if (sceneContainer !== null) {
//     sceneContainer.style.height = `${sceneContainer.clientWidth}px`;
//     renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
//   }
// };

// function animate() {
//   requestAnimationFrame(animate);

//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;

//   renderer.render(scene, camera);
// }

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// const loader = new GLTFLoader();

// async loadModel = () => {
// const loader = new GLTFLoader();
// }

const initModel = async () => {
  const container = document.querySelector('#model-scene-container');

  if (container !== null) {
    // create a new world
    const model = new ModelsHelper(container);

    // complete async tasks
    await model.init();

    // start the animation loop
    model.start();
  }
};

onMounted(() => {
  initModel();
  // init();
  // sceneContainer = document.querySelector('#model-scene-container');
  // if (WebGL.isWebGLAvailable()) {
  //   resizeScene();
  //   renderScene();
  // } else {
  //   console.log(WebGL.getWebGLErrorMessage());
  // }
  // // animate();
  // window.addEventListener('resize', resizeScene);
});

// onUnmounted(() => {
//   window.removeEventListener('resize', resizeScene);
// });
</script>
