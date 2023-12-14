<template>
  <div class="w-full">
    <div class="section">
      <div class="container relative">
        <div class="w-full h-screen flex items-center justify-center">
          <div class="w-full max-w-[100vh] h-screen max-h-[100vw]" id="cube-scene-container"></div>
        </div>
        <div class="w-full flex flex-col gap-3 absolute top-[50px] left-0 z-20">
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Radius:</div>
            <label for="input_radius">
              <input
                type="number"
                id="input_radius"
                class="text-black"
                min="0.5"
                max="7"
                step="0.1"
                v-model="state.tubeRadius"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="text-[18px] font-bold">Color:</div>
            <label for="input_radius">
              <input
                type="text"
                id="input_radius"
                class="text-black"
                v-model="state.tubeColor"
                @change="updateColor()"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BufferGeometry,
  Color,
  Curve,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  TubeGeometry,
  Vector3,
  WireframeGeometry,
  WebGLRenderer
} from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { onMounted, onUnmounted, reactive, watch } from 'vue';

const state = reactive({
  tubeRadius: 1,
  tubeColor: 'black'
});

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

const updateGroupGeometry = (mesh: any, geometry: any) => {
  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();

  mesh.children[0].geometry = new WireframeGeometry(geometry);
  mesh.children[1].geometry = geometry;
};

const tubeGeometry = (mesh: any) => {
  const data = {
    segments: 100,
    radius: state.tubeRadius,
    radialSegments: 20
  };

  const path = new CustomSinCurve(10);

  const generateGeometry = () => {
    updateGroupGeometry(
      mesh,
      new TubeGeometry(path, data.segments, data.radius, data.radialSegments, false)
    );
  };

  generateGeometry();
};

// const gui = new GUI();

const scene = new Scene();
scene.background = null;

const camera = new PerspectiveCamera(75, 1, 0.1, 50);
camera.position.z = 30;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;

const lights = [];
lights[0] = new DirectionalLight(0xffffff, 3);
lights[1] = new DirectionalLight(0xffffff, 3);
lights[2] = new DirectionalLight(0xffffff, 3);

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

const group = new Group();

const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute([], 3));

const lineMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const meshMaterial = new MeshPhongMaterial({
  color: 'black',
  emissive: 'black',
  side: DoubleSide,
  flatShading: true
});

group.add(new LineSegments(geometry, lineMaterial));
group.add(new Mesh(geometry, meshMaterial));

tubeGeometry(group);

scene.add(group);

let sceneContainer: HTMLElement | null = null;

const renderScene = () => {
  if (sceneContainer !== null) {
    renderer.setClearColor(0xffffff, 0);
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

  group.rotation.x += 0.001;
  group.rotation.y += 0.001;

  renderer.render(scene, camera);
}

const updateColor = () => {
  group.children[1].material.color.set(state.tubeColor);
};

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

watch(
  () => state.tubeRadius,
  () => {
    tubeGeometry(group);
  }
);
</script>
