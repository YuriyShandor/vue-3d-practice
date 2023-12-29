<template>
  <div class="w-full">
    <div class="container relative z-10">
      <div class="w-full h-screen flex items-center justify-center">
        <div class="w-full max-w-[100vh] h-screen max-h-[100vw]" id="chair-v2-scene-container">
          <canvas id="canvas" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>
    <div class="w-auto absolute top-[60px] left-[10px] flex gap-[5px] z-20">
      <div
        class="w-[55px] h-[55px] px-[10px] py-[10px] bg-slate-500 hover:bg-slate-600 rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200"
        :class="{ '!bg-slate-700': state.activeOption === item.label }"
        data-option="item.label"
        v-for="item in details"
        :key="item.label"
        @click="state.activeOption = item.label"
      >
        <img :src="item.image" alt="" />
      </div>
    </div>

    <div class="w-auto absolute bottom-0 left-0 flex flex-wrap gap-[5px] z-20">
      <div
        class="w-[55px] h-[55px] rounded-md overflow-hidden cursor-pointer transition-colors duration-200"
        data-option="item.label"
        v-for="item in colors"
        :key="item.texture ? item.texture : item.color"
        @click="selectColor(item)"
      >
        <img v-if="item.texture" :src="item.texture" class="w-full h-full" alt="" />
        <div v-else class="w-full h-full" :style="{ background: `#${item.color}` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue';
import {
  Scene,
  Color,
  Fog,
  WebGLRenderer,
  PerspectiveCamera,
  MeshPhongMaterial,
  HemisphereLight,
  DirectionalLight,
  Vector2,
  PlaneGeometry,
  Mesh,
  TextureLoader,
  RepeatWrapping
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const state = reactive({
  activeOption: 'legs'
});

const BACKGROUND_COLOR = 0xf1f1f1;

let camera: any, scene: any, renderer: any;

let sceneContainer: HTMLElement | null = null;

const INITIAL_MTL = new MeshPhongMaterial({ color: BACKGROUND_COLOR, shininess: 10 });

const INITIAL_MAP = [
  { childID: 'back', mtl: INITIAL_MTL },
  { childID: 'base', mtl: INITIAL_MTL },
  { childID: 'cushions', mtl: INITIAL_MTL },
  { childID: 'legs', mtl: INITIAL_MTL },
  { childID: 'supports', mtl: INITIAL_MTL }
];

let theModel: any;

const details = [
  {
    label: 'legs',
    image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/legs.svg'
  },
  {
    label: 'cushions',
    image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/cushions.svg'
  },
  {
    label: 'base',
    image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/base.svg'
  },
  {
    label: 'supports',
    image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/supports.svg'
  },
  {
    label: 'back',
    image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/back.svg'
  }
];

const colors = [
  {
    texture: './textures/chair-v2/wood_.jpg',
    size: [2, 2, 2],
    shininess: 60
  },
  {
    texture: './textures/chair-v2/fabric_.jpg',
    size: [4, 4, 4],
    shininess: 0
  },
  {
    texture: './textures/chair-v2/pattern_.jpg',
    size: [8, 8, 8],
    shininess: 10
  },
  {
    texture: './textures/chair-v2/denim_.jpg',
    size: [3, 3, 3],
    shininess: 0
  },
  {
    texture: './textures/chair-v2/quilt_.jpg',
    size: [6, 6, 6],
    shininess: 0
  },
  {
    color: '131417'
  },
  {
    color: '374047'
  },
  {
    color: '5f6e78'
  },
  {
    color: '7f8a93'
  },
  {
    color: '97a1a7'
  },
  {
    color: 'acb4b9'
  },
  {
    color: 'DF9998'
  },
  {
    color: '7C6862'
  },
  {
    color: 'A3AB84'
  },
  {
    color: 'D6CCB1'
  },
  {
    color: 'F8D5C4'
  },
  {
    color: 'A3AE99'
  },
  {
    color: 'EFF2F2'
  },
  {
    color: 'B0C5C1'
  },
  {
    color: '8B8C8C'
  },
  {
    color: '565F59'
  },
  {
    color: 'CB304A'
  },
  {
    color: 'FED7C8'
  },
  {
    color: 'C7BDBD'
  },
  {
    color: '3DCBBE'
  },
  {
    color: '264B4F'
  },
  {
    color: '389389'
  },
  {
    color: '85BEAE'
  },
  {
    color: 'F2DABA'
  },
  {
    color: 'F2A97F'
  },
  {
    color: 'D85F52'
  },
  {
    color: 'D92E37'
  },
  {
    color: 'FC9736'
  },
  {
    color: 'F7BD69'
  },
  {
    color: 'A4D09C'
  },
  {
    color: '4C8A67'
  },
  {
    color: '25608A'
  },
  {
    color: '75C8C6'
  },
  {
    color: 'F5E4B7'
  },
  {
    color: 'E69041'
  },
  {
    color: 'E56013'
  },
  {
    color: '11101D'
  },
  {
    color: '630609'
  },
  {
    color: 'C9240E'
  },
  {
    color: 'EC4B17'
  },
  {
    color: '281A1C'
  },
  {
    color: '4F556F'
  },
  {
    color: '64739B'
  },
  {
    color: 'CDBAC7'
  },
  {
    color: '946F43'
  },
  {
    color: '66533C'
  },
  {
    color: '173A2F'
  },
  {
    color: '153944'
  },
  {
    color: '27548D'
  },
  {
    color: '438AAC'
  }
];

const render = () => {
  renderer.render(scene, camera);
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

    camera.updateProjectionMatrix();
  }
};

const initScene = () => {
  scene = new Scene();
  scene.background = new Color(0x141414);
  scene.fog = new Fog(BACKGROUND_COLOR, 20, 100);

  camera = new PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 5;
  camera.position.x = 0;

  const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
  if (canvas !== null) {
    renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.addEventListener('change', render);
    controls.update();

    setTimeout(() => {
      render();
    }, 100);
  }

  loadModel();
  initSceneLights();
};

const initSceneLights = () => {
  const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  const dirLight = new DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new Vector2(1024, 1024);
  scene.add(dirLight);
};

const initColor = (parent: any, type: any, mtl: any) => {
  parent.traverse((o: any) => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type;
      }
    }
  });
};

const loadModel = () => {
  const loader = new GLTFLoader().setPath('./models/');
  loader.load('chair-v2.glb', (gltf) => {
    theModel = gltf.scene;

    theModel.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    theModel.scale.set(2, 2, 2);
    theModel.rotation.y = Math.PI;

    theModel.position.y = -1;

    for (let object of INITIAL_MAP) {
      initColor(theModel, object.childID, object.mtl);
    }

    scene.add(theModel);
  });
};

const setMaterial = (parent: any, type: any, mtl: any) => {
  parent.traverse((o: any) => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
};

const selectColor = (color: any) => {
  let new_mtl;

  if (color.texture) {
    let txt = new TextureLoader().load(color.texture);

    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = RepeatWrapping;
    txt.wrapT = RepeatWrapping;

    new_mtl = new MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10
    });
  } else {
    new_mtl = new MeshPhongMaterial({
      color: parseInt('0x' + color.color),
      shininess: color.shininess ? color.shininess : 10
    });
  }

  setMaterial(theModel, state.activeOption, new_mtl);

  setTimeout(() => {
    render();
  }, 100);
};

onMounted(() => {
  sceneContainer = document.querySelector('#chair-v2-scene-container');

  initScene();
  resizeScene();
  renderScene();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeScene);
});
</script>

<style>
.loading {
  position: fixed;
  z-index: 50;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.controls {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.info {
  padding: 0 1em;
  display: flex;
  justify-content: flex-end;
}
.info p {
  margin-top: 0;
}
.tray {
  width: 100%;
  height: 50px;
  position: relative;
  overflow-x: hidden;
}
.tray__slide {
  position: absolute;
  display: flex;
  left: 0;
  transform: translateX(-50%);
  animation: wheelin 1s 2s ease-in-out forwards;
}
.tray__swatch {
  transition: 0.1s ease-in;
  height: 50px;
  min-width: 50px;
  flex: 1;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  background-size: cover;
  background-position: center;
}
.tray__swatch:nth-child(5n + 5) {
  margin-right: 20px;
}
.drag-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
  width: 10em;
  height: 10em;
  box-sizing: border-box;
  font-size: 0.9em;
  font-weight: 800;
  text-transform: uppercase;
  text-align: center;
  border-radius: 5em;
  background: white;
  position: absolute;
}
.drag-notice.start {
  animation: popout 0.25s 3s forwards;
}
@keyframes popout {
  to {
    transform: scale(0);
  }
}
@keyframes wheelin {
  to {
    transform: translateX(0);
  }
}
@media (max-width: 960px) {
  .options {
    top: 0;
  }
  .info {
    padding: 0 1em 1em 0;
  }
  .info__message {
    display: flex;
    align-items: flex-end;
  }
  .info__message p {
    margin: 0;
    font-size: 0.7em;
  }
}
@media (max-width: 720px) {
  .info {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 1em 1em;
  }
  .info__message {
    margin-bottom: 1em;
  }
}
@media (max-width: 680px) {
  .info {
    padding: 1em 2em;
  }
  .info__message {
    display: none;
  }
  .options {
    bottom: 50px;
  }
  .option {
    margin-bottom: 1px;
    padding: 5px;
    height: 45px;
    width: 45px;
    display: flex;
  }
  .option.--is-active {
    border-right: 2px solid red;
    width: 47px;
  }
  .option img {
    height: 100%;
    width: auto;
    pointer-events: none;
  }
}
</style>
