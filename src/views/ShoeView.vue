<template>
  <div class="w-full">
    <div class="container">
      <div class="w-full h-screen flex items-center justify-center">
        <div class="w-full max-w-[100vh] h-screen max-h-[100vw]" id="shoe-scene-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import {
  Scene,
  PerspectiveCamera,
  EquirectangularReflectionMapping,
  WebGLRenderer,
  ACESFilmicToneMapping
} from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

let camera: any, scene: any, renderer: any;
let gui: any;

let sceneContainer: HTMLElement | null = null;

const state = { variant: 'midnight' };

const render = () => {
  renderer.render(scene, camera);
};

const loadModel = () => {
  camera = new PerspectiveCamera(45, 1, 0.25, 20);
  camera.position.set(2.5, 1.5, 3.0);

  scene = new Scene();

  // const loader = new GLTFLoader().setPath('./models/MaterialsVariantsShoe/');
  // loader.load('MaterialsVariantsShoe.gltf', function (gltf) {
  //   gltf.scene.scale.set(10.0, 10.0, 10.0);

  //   console.log(gltf);

  //   scene.add(gltf.scene);

  //   gui = new GUI();

  //   const parser = gltf.parser;
  //   const variantsExtension = gltf.userData.gltfExtensions['KHR_materials_variants'];
  //   const variants = variantsExtension.variants.map((variant: any) => variant.name);
  //   const variantsCtrl = gui.add(state, 'variant', variants).name('Variant');

  //   selectVariant(scene, parser, variantsExtension, state.variant);

  //   variantsCtrl.onChange((value: any) => selectVariant(scene, parser, variantsExtension, value));

  //   render();
  // });

  new RGBELoader()
    .setPath('./textures/equirectangular/')
    .load('quarry_01_1k.hdr', function (texture) {
      texture.mapping = EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      render();

      const loader = new GLTFLoader().setPath('./models/MaterialsVariantsShoe/');
      loader.load('MaterialsVariantsShoe.gltf', function (gltf) {
        gltf.scene.scale.set(10.0, 10.0, 10.0);

        scene.add(gltf.scene);

        // GUI
        gui = new GUI();

        // Details of the KHR_materials_variants extension used here can be found below
        // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_variants
        const parser = gltf.parser;
        const variantsExtension = gltf.userData.gltfExtensions['KHR_materials_variants'];
        const variants = variantsExtension.variants.map((variant: any) => variant.name);
        const variantsCtrl = gui.add(state, 'variant', variants).name('Variant');

        selectVariant(scene, parser, variantsExtension, state.variant);

        variantsCtrl.onChange((value: any) =>
          selectVariant(scene, parser, variantsExtension, value)
        );

        render();
      });
    });

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderScene();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0.5, -0.2);
  controls.update();
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

    renderer.render(scene, camera);
  });
};

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
  // if (mesh) {
  //   mesh.rotateY(Math.PI / 360);
  // }

  renderer.render(scene, camera);

  // controls.update();

  // requestAnimationFrame(animate);
}

onMounted(() => {
  sceneContainer = document.querySelector('#shoe-scene-container');

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
