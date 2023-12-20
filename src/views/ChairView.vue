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
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  sRGBEncoding,
  TextureLoader,
  EquirectangularReflectionMapping
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let camera: any, scene: any, renderer: any;
let parser: any, variantsExtension: any;

let sceneContainer: HTMLElement | null = null;

const state = reactive({
  variants: [] as any[],
  selectedVariant: '' as string
});

const render = () => {
  renderer.render(scene, camera);
};

const setBg = () => {
  new TextureLoader().setPath('./images/').load('Screenshot_6.png', (texture) => {
    texture.encoding = sRGBEncoding;

    scene.background = texture;
    render();
  });
};

const setEnvironment = () => {
  new RGBELoader().setPath('./textures/').load('venice_sunset_1k.hdr', (texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.environment = texture;
    render();
  });
};

const selectVariant = (scene: any, parser: any, extension: any, variantName: any) => {
  const variantIndex = extension.variants.findIndex((v: any) => v.name.includes(variantName));

  scene.traverse(async (object: any) => {
    if (!object.isMesh || !object.userData.gltfExtensions) return;

    const meshVariantDef = object.userData.gltfExtensions['KHR_materials_variants'];

    if (!meshVariantDef) return;

    if (!object.userData.originalMaterial) {
      object.userData.originalMaterial = object.material;
    }

    const mapping = meshVariantDef.mappings.find((mapping: any) =>
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
};

const loadModel = () => {
  const loader = new GLTFLoader().setPath('./models/');
  loader.load('chair.glb', (gltf) => {
    gltf.scene.scale.set(3.0, 3.0, 3.0);

    scene.add(gltf.scene);

    parser = gltf.parser;

    if ('gltfExtensions' in gltf.userData) {
      variantsExtension = gltf.userData.gltfExtensions['KHR_materials_variants'];
      variantsExtension.variants.forEach((item: any) => {
        state.variants.push(item.name);
      });
      state.selectedVariant = state.variants[0];
    }

    render();
  });
};

function initScene() {
  camera = new PerspectiveCamera(45, 1, 0.25, 20);
  camera.position.set(2.5, 1.5, 3.0);

  scene = new Scene();

  renderer = new WebGLRenderer({ antialias: true });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = SRGBColorSpace;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0.8, 0);
  controls.update();

  setEnvironment();
  setBg();
  loadModel();
}

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

onMounted(() => {
  sceneContainer = document.querySelector('#chair-scene-container');

  initScene();
  resizeScene();
  renderScene();

  window.addEventListener('resize', resizeScene);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeScene);
});

watch(
  () => state.selectedVariant,
  () => {
    selectVariant(scene, parser, variantsExtension, state.selectedVariant);
  }
);
</script>
