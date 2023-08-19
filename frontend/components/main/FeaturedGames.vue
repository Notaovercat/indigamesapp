<script setup lang="ts">
import { IGamePreview } from "@/types/gamePreview";

const games = ref<IGamePreview[] | undefined>([]);

const gameStore = useGames();

games.value = await gameStore.getFeaturedGames();
</script>

<template>
  <!-- <h1 class="feat-title pt-2 pl-2 font-bold text-3xl">Featured Games</h1> -->
  <h1 class="feat-title pt-2 pl-2 font-bold text-3xl">Пиздатые игры</h1>
  <ul
    class="feat-list pl-4 pt-9 grid md:grid-cols-3 grid-cols-1 gap-9 pb-8 h-auto md:justify-start"
  >
    <li v-for="game of games" :key="game.id">
      <MainGameCard :content="game" />
    </li>
  </ul>
</template>
