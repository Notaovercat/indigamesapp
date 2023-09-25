<script setup lang="ts">
import { Bars3BottomLeftIcon } from "@heroicons/vue/20/solid";

definePageMeta({
  name: "main",
});

const sideBar = ref(false);
</script>
<!-- bg-[#241468] -->
<template>
  <div
    class="max-w-screen-xl bg-[#241468] bg-opacity-80 text-white mx-auto flex flex-col my-5 pb-2 rounded-lg"
  >
    <section class="banner max-w-7xl m-2">
      <MainBanner />
    </section>

    <section class="main m-2">
      <div class="grid md:grid-cols-4 grid-cols-1 gap-4">
        <div class="hidden md:block">
          <MainSideMenu />
        </div>
        <!-- MOBILE SIDEBAR -->
        <div class="relative block md:hidden p-3">
          <button
            class="absolute left-0 top-0 z-50 bg-[#2e0d3f] p-2 rounded"
            @click="sideBar = !sideBar"
          >
            <Bars3BottomLeftIcon class="w-5" />
          </button>

          <div
            class="absolute left-0 top-8 min-h-screen w-2/3 bg-opacity-50 z-40"
            v-if="sideBar"
          >
            <MainSideMenu />
          </div>
        </div>

        <div
          v-if="sideBar"
          class="z-30 h-screen w-full flex absolute bg-black left-0 top-0 bg-opacity-60"
        ></div>

        <div class="col-span-3">
          <MainFeaturedGames />
          <MainLastUpdated />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
::-webkit-scrollbar-track {
  background-color: #241468;
  border-radius: 10px;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #861598;
}
</style>
