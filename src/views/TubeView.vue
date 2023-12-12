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
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  Curve,
  CylinderGeometry,
  DirectionalLight,
  DodecahedronGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LatheGeometry,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PlaneGeometry,
  RingGeometry,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WireframeGeometry,
  WebGLRenderer
} from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { onMounted, onUnmounted } from 'vue';

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

function updateGroupGeometry(mesh, geometry) {
  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();

  mesh.children[0].geometry = new WireframeGeometry(geometry);
  mesh.children[1].geometry = geometry;
}

const tubeGeometry = (mesh: any) => {
  const data = {
    segments: 20,
    radius: 2,
    radialSegments: 8
  };

  const path = new CustomSinCurve(10);

  const generateGeometry = () => {
    updateGroupGeometry(
      mesh,
      new TubeGeometry(path, data.segments, data.radius, data.radialSegments, false)
    );
  };

  const folder = gui.addFolder('THREE.TubeGeometry');

  folder.add(data, 'segments', 1, 100).step(1).onChange(generateGeometry);
  folder.add(data, 'radius', 1, 10).onChange(generateGeometry);
  folder.add(data, 'radialSegments', 1, 20).step(1).onChange(generateGeometry);

  generateGeometry();
};

const gui = new GUI();

const scene = new Scene();
scene.background = new Color(0x444444);

const camera = new PerspectiveCamera(75, 1, 0.1, 50);
camera.position.z = 30;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

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
  color: 0x156289,
  emissive: 0x072534,
  side: DoubleSide,
  flatShading: true
});

group.add(new LineSegments(geometry, lineMaterial));
group.add(new Mesh(geometry, meshMaterial));

tubeGeometry(group);

scene.add(group);

// function render() {
//   requestAnimationFrame(render);

//   group.rotation.x += 0.001;
//   group.rotation.y += 0.001;

//   renderer.render(scene, camera);
// }

// window.addEventListener(
//   'resize',
//   function () {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize(window.innerWidth, window.innerHeight);
//   },
//   false
// );

// render();

// import { onMounted, onUnmounted } from 'vue';
// import {
//   Scene,
//   PerspectiveCamera,
//   WebGLRenderer,
//   Curve,
//   Vector3,
//   TubeGeometry,
//   MeshBasicMaterial,
//   Mesh
// } from 'three';
// import WebGL from 'three/addons/capabilities/WebGL.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// const scene = new Scene();
// scene.background = null;
// const camera = new PerspectiveCamera(50, 1, 0.1, 2000);
// camera.position.z = 13;

// const renderer = new WebGLRenderer({ alpha: true });
// const controls = new OrbitControls(camera, renderer.domElement);

// class CustomSinCurve extends Curve {
//   constructor(scale = 1) {
//     super();
//     this.scale = scale;
//   }

//   getPoint(t, optionalTarget = new Vector3()) {
//     const tx = t * 3 - 1.5;
//     const ty = Math.sin(2 * Math.PI * t);
//     const tz = 0;

//     return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
//   }
// }

// const path = new CustomSinCurve(1);
// const geometry = new TubeGeometry(path, 64, 2, 8, false);
// const material = new MeshBasicMaterial({ color: 0x00ff00 });
// const mesh = new Mesh(geometry, material);
// scene.add(mesh);

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

  group.rotation.x += 0.001;
  group.rotation.y += 0.001;

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

  window.addEventListener('resize', resizeScene);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeScene);
});
</script>
