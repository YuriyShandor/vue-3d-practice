<template>
  <div class="w-full">
    <div class="section">
      <div class="container relative">
        <div class="w-full h-screen flex items-center justify-center">
          <div
            class="w-full max-w-[100vh] h-screen max-h-[100vw]"
            id="cube-model-scene-container"
          ></div>
        </div>
        <div class="w-full flex flex-col gap-3 absolute top-[50px] left-0 z-20">
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Cube X:</div>
            <label for="input_radius">
              <input
                type="number"
                id="input_radius"
                class="text-black"
                min="0.5"
                max="10"
                step="0.1"
                v-model="state.cubeX"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Cube Y:</div>
            <label for="input_radius">
              <input
                type="number"
                id="input_radius"
                class="text-black"
                min="0.5"
                max="10"
                step="0.1"
                v-model="state.cubeY"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Cube Z:</div>
            <label for="input_radius">
              <input
                type="number"
                id="input_radius"
                class="text-black"
                min="0.5"
                max="10"
                step="0.1"
                v-model="state.cubeZ"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Cube Color:</div>
            <label for="input_radius">
              <input
                type="text"
                id="input_radius"
                class="text-black"
                v-model="state.cubeColor"
                @change="updateFirstCubeColor()"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Cylinder X:</div>
            <label for="input_radius">
              <input
                type="number"
                id="input_radius"
                class="text-black"
                min="0.5"
                max="10"
                step="0.1"
                v-model="state.cylinderX"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Cylinder Y:</div>
            <label for="input_radius">
              <input
                type="number"
                id="input_radius"
                class="text-black"
                min="0.5"
                max="10"
                step="0.1"
                v-model="state.cylinderY"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Cylinder Z:</div>
            <label for="input_radius">
              <input
                type="number"
                id="input_radius"
                class="text-black"
                min="0.5"
                max="10"
                step="0.1"
                v-model="state.cylinderZ"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Cylinder Color:</div>
            <label for="input_radius">
              <input
                type="text"
                id="input_radius"
                class="text-black"
                v-model="state.cylinderColor"
                @change="updateCylinderCubeColor()"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, watch } from 'vue';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  HemisphereLight,
  MeshPhongMaterial,
  AmbientLight
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const state = reactive({
  cubeX: 1,
  cubeY: 1,
  cubeZ: 1,
  cubeColor: '',
  cylinderX: 1,
  cylinderY: 1,
  cylinderZ: 1,
  cylinderColor: ''
});

let camera: any, scene: any, renderer: any;
let controls: any;

let cube: any, cylinder: any, ball: any;

let sceneContainer: HTMLElement | null = null;

const render = () => {
  renderer.render(scene, camera);
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

const initScene = () => {
  scene = new Scene();
  scene.background = '#000000';
  scene.add(new AmbientLight(0xffffff, 0.6));
  camera = new PerspectiveCamera(33, 1, 0.1, 1000);
  camera.position.set(13, 3, 3);
  // camera.position.z = 15;
  // camera.lookAt(scene.position);

  renderer = new WebGLRenderer({ alpha: true });

  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.update();

  loadModel();

  setTimeout(() => {
    render();
  }, 100);
};

const loadModel = () => {
  new GLTFLoader().load('./models/cube.glb', (gltf) => {
    scene.add(gltf.scene);

    // gltf.scene.position.x = 13;
    // gltf.scene.position.y = 73;
    // gltf.scene.position.z = 13;

    // console.log(gltf);

    camera.lookAt(gltf.scene.position);

    controls.target.copy(gltf.scene.position);

    console.log(gltf.scene);

    gltf.scene.children.forEach((item) => {
      if (item.name === 'Cube') {
        cube = item;
      } else if (item.name === 'Mball') {
        ball = item;
      } else if (item.name === 'Cylinder') {
        cylinder = item;
      }
    });

    cube = gltf.scene.children[0];
    cube.scale.x = state.cubeX;
    cube.scale.y = state.cubeY;
    cube.scale.z = state.cubeZ;
  });
};

const updateFirstCubeColor = () => {
  cube.material = new MeshPhongMaterial({
    color: state.cubeColor,
    shininess: 10
  });
  render();
};

const updateCylinderCubeColor = () => {
  cylinder.material = new MeshPhongMaterial({
    color: state.cylinderColor,
    shininess: 10
  });
  render();
};

onMounted(() => {
  sceneContainer = document.querySelector('#cube-model-scene-container');

  initScene();
  resizeScene();
  renderScene();

  window.addEventListener('resize', resizeScene);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeScene);
});

watch(
  () => state.cubeX,
  () => {
    cube.scale.x = state.cubeX;
    render();
  }
);

watch(
  () => state.cubeY,
  () => {
    cube.scale.y = state.cubeY;
    render();
  }
);

watch(
  () => state.cubeZ,
  () => {
    cube.scale.z = state.cubeZ;
    render();
  }
);

watch(
  () => state.cylinderX,
  () => {
    cylinder.scale.x = state.cylinderX;
    render();
  }
);

watch(
  () => state.cylinderY,
  () => {
    cylinder.scale.y = state.cylinderY;
    render();
  }
);

watch(
  () => state.cylinderZ,
  () => {
    cylinder.scale.z = state.cylinderZ;
    render();
  }
);
</script>
