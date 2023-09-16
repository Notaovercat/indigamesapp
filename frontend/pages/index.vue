<script setup lang="ts">
definePageMeta({
  name: "main",
});
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
