<script setup lang="ts">
import { IGamePreview } from "@/types/games/gamePreview.interface";

const gameStore = useGames();

if (gameStore.featuredGames.length <= 0) await gameStore.getFeaturedGames();

const games: Ref<IGamePreview[]> = ref(gameStore.featuredGames);

const errorMsg = ref(gameStore.errorMsg);
</script>

<template>
  <!-- <h1 class="feat-title pt-2 pl-2 font-bold text-3xl">Featured Games</h1> -->
  <h1 class="feat-title pt-2 pl-2 font-bold text-3xl">Featured</h1>
  <ul
    v-if="games?.length > 0"
    class="feat-list pl-4 pt-9 grid md:grid-cols-3 grid-cols-1 gap-9 pb-8 h-auto md:justify-start"
  >
    <li v-for="game of games" :key="game.id">
      <MainGameCard :content="game" />
    </li>
  </ul>
  <div v-else class="flex justify-center items-center h-56">
    <h1 class="text-3xl font-bold">Wait for the updates...</h1>
  </div>
</template>
