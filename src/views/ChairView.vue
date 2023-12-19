<template>
  <div class="w-full">
    <div class="container relative">
      <div class="w-full h-screen flex items-center justify-center">
        <div class="w-full max-w-[100vh] h-screen max-h-[100vw]" id="chair-scene-container"></div>
      </div>
      <div class="w-full flex flex-col gap-3 absolute top-[50px] left-0 z-20">
        <div class="flex gap-2">
          <div class="text-[18px] font-bold">Variant:</div>
          <select
            name="variants_select"
            id="variants_select"
            class="text-black"
            v-model="state.selectedVariant"
          >
            <option v-for="item in state.variants" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera: any, scene: any, renderer: any, gui: any;

let sceneContainer: HTMLElement | null = null;

const state = { variant: 'Default' };

const render = () => {
  renderer.render(scene, camera);
};

const setBg = () => {
  new THREE.TextureLoader().setPath('./images/').load(
    'radial.jpg',
    (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      scene.background = texture;
      render();
    },
    null,
    (err) => {
      console.error(err);
      console.log(err.message);
    }
  );
}

const setEnvironment = () => {
  new RGBELoader().setPath('./textures/').load('venice_sunset_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture;

    render();
  });
}

const loadModel = () => {
  const loader = new GLTFLoader().setPath('./models/');
  loader.load('chair.glb', (gltf) => {
    gltf.scene.scale.set(3.0, 3.0, 3.0);

    scene.add(gltf.scene);

    // GUI
    gui = new GUI();

    // Details of the KHR_materials_variants extension used here can be found below
    // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_variants
    const parser = gltf.parser;

    let variantsExtension;

    if ('gltfExtensions' in gltf.userData) {
      variantsExtension = gltf.userData.gltfExtensions['KHR_materials_variants'];
    }

    if (variantsExtension != null) {
      const variants = variantsExtension.variants.map((variant) => variant.name);
      const variantsCtrl = gui.add(state, 'variant', variants).name('Variant');

      selectVariant(scene, parser, variantsExtension, state.variant);

      variantsCtrl.onChange((value) => selectVariant(scene, parser, variantsExtension, value));
    }

    render();
  });
}

function selectVariant(scene, parser, extension, variantName) {
  const variantIndex = extension.variants.findIndex((v) => v.name.includes(variantName));

  scene.traverse(async (object) => {
    if (!object.isMesh || !object.userData.gltfExtensions) return;

    const meshVariantDef = object.userData.gltfExtensions['KHR_materials_variants'];

    if (!meshVariantDef) return;

    if (!object.userData.originalMaterial) {
      object.userData.originalMaterial = object.material;
    }

    const mapping = meshVariantDef.mappings.find((mapping) =>
      mapping.variants.includes(variantIndex)
    );

    if (mapping) {
      object.material = await parser.getDependency('material', mapping.material);
      parser.assignFinalMaterial(object);
    } else {
      object.material = object.userData.originalMaterial;
    }

    render();
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
  camera.position.set(2.5, 1.5, 3.0);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0.8, 0);
  controls.update();

  window.addEventListener('resize', onWindowResize);

  setEnvironment();
  setBg();
  loadModel();
}

const renderScene = () => {
  if (sceneContainer !== null) {
    sceneContainer.appendChild(renderer.domElement);
  }
};

onMounted(() => {
  init();
  render();
});
</script>
