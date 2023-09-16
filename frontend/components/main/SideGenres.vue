<script setup lang="ts">
import { IGenre } from "@/types/games/game.interface";

const genres: Ref<IGenre[]> = ref([]);

const genresStore = useGenres();
if (genresStore.genres.length <= 0) await genresStore.getGenres();

watch(
  () => genresStore.genres,
  () => (genres.value = genresStore.genres),
  { immediate: true }
);
</script>

<template>
  <div class="m-2">
    <h2 class="pt-4 pl-2 font-bold text-2xl">Genres</h2>
    <ul class="flex flex-col gap-2 text-xl pl-8 py-5">
      <li class="flex flex-col w-full" v-for="genre of genres" :key="genre.id">
        <NuxtLink
          :class="[
            'hover:bg-gradient-to-r from-blue-900 to-blue-800 rounded-md py-2 pl-5 mr-6 inline select-none cursor-pointer transition-all duration-75 ease-in-out',
            useRoute().query.genre === genre.name
              ? 'bg-gradient-to-r from-blue-900 to-blue-800'
              : '',
          ]"
          :to="{ name: 'all', query: { genre: genre.name } }"
        >
          {{ genre.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
