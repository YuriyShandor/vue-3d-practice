<template>
  <div class="w-full">
    <div class="container">
      <div id="scene-container" class="w-full h-[80vh] bg-black"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { World } from '@/helpers/3D/world';

const render3D = () => {
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  // Create an instance of the World app
  const world = new World(container);

  // Start the loop (produce a stream of frames)
  world.start();
};
onMounted(() => {
  console.log('Hello World!');

  render3D();
});
</script>
