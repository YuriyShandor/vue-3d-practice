<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header
    class="header w-screen fixed top-0 left-0 z-1000 backdrop-blur transition-transform duration-300"
  >
    <div class="w-full h-full absolute top-0 left-0 z-10 bg-secondary-background opacity-50"></div>
    <div class="w-full relative z-20">
      <div class="container">
        <div
          class="h-full flex flex-wrap justify-center items-center py-[5px] lg:py-[10px] gap-[10px] lg:gap-[20px]"
        >
          <RouterLink to="/cube">Cube</RouterLink>
          <RouterLink to="/model">Model</RouterLink>
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>
