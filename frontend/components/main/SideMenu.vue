<script setup lang="ts">
const genres = ref(["RPG", "Shooter", "Strategy"]);
const platforms = ref(["PC", "Linux", "Adndriod"]);
</script>

<template>
  <div class="sidemenu bg-[#332088] shadow-xl rounded-lg h-full">
    <div class="sidemenu-genres m-2">
      <h2 class="genres pt-4 pl-2 font-bold text-2xl">Genres</h2>
      <ul class="genres-list flex flex-col gap-2 text-xl pl-8 py-5">
        <li
          class="genres-title hover:bg-[#EA1179] hover:text-white py-2 pl-5 mr-6 inline rounded-xl select-none cursor-pointer transition-colors"
          v-for="genre of genres"
        >
          {{ genre }}
        </li>
      </ul>
    </div>

    <div class="sidemenu-platforms m-2">
      <h2 class="platforms pt-2 pl-2 font-bold text-2xl">Platforms</h2>
      <ul class="platforms-list flex flex-col gap-2 text-xl pl-8 py-5">
        <li
          class="platform-title hover:bg-[#EA1179] hover:text-white py-2 pl-5 mr-6 inline rounded-xl select-none cursor-pointer transition-colors"
          v-for="platform of platforms"
        >
          {{ platform }}
        </li>
      </ul>
    </div>
  </div>
</template>
