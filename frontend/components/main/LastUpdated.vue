<script setup lang="ts">
import { IGamePreview } from "@/types/gamePreview";

const games = ref<IGamePreview[] | undefined>([]);

const gameStore = useGames();

games.value = await gameStore.getLastGames();
</script>

<template>
  <!-- <h1 class="feat-title pt-2 pl-2 font-bold text-3xl">Last Updated</h1> -->
  <h1 class="feat-title pt-2 pl-2 font-bold text-3xl pb-6">Все игры</h1>
  <ul
    class="pl-4 pt-9 grid md:grid-cols-3 grid-cols-1 gap-9 md:h-[600px] h-auto md:overflow-y-scroll md:justify-start"
  >
    <li v-for="game of games" :key="game.id">
      <MainGameCard :content="game" />
    </li>
  </ul>
</template>
