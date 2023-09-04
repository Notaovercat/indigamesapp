<script setup lang="ts">
import { IGamePreview } from "@/types/games/gamePreview.interface";

const games = ref<IGamePreview[] | undefined>([]);

const gameStore = useGames();

games.value = await gameStore.getLastGames();

const error = gameStore.errorlg;
</script>

<template>
  <!-- <h1 class="feat-title pt-2 pl-2 font-bold text-3xl">Last Updated</h1> -->
  <h1 class="feat-title pt-2 pl-2 font-bold text-3xl pb-6">Все игры</h1>
  <ul
    v-if="games && games.length > 0"
    class="pl-4 pt-9 grid md:grid-cols-3 grid-cols-1 gap-9 md:h-[600px] h-auto md:overflow-y-scroll md:justify-start"
  >
    <li v-for="game of games" :key="game.id">
      <MainGameCard :content="game" />
    </li>
  </ul>
  <div v-else class="flex justify-center items-center h-56">
    <h1 v-if="error" class="text-3xl font-bold text-red-100">{{ error }}</h1>
    <h1 v-else class="text-3xl font-bold">There is empty...</h1>
  </div>
</template>
types/gamePreview.interface
