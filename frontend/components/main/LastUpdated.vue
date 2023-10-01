<script setup lang="ts">
import { IGamePreview } from "@workspace/shared";

const gameStore = useGames();

await gameStore.getLastGames({ take: 6 });

const games: Ref<IGamePreview[]> = ref(gameStore.lastGames);

const errorMsg = ref(gameStore.errorMsg);
</script>

<template>
  <!-- <h1 class="feat-title pt-2 pl-2 font-bold text-3xl">Last Updated</h1> -->
  <div
    class="flex flex-col pl-0 md:pl-6 items-center md:items-start md:h-[72rem] md:overflow-y-scroll"
  >
    <h1 class="pt-2 font-bold text-3xl pb-6">All games</h1>
    <div v-if="games.length > 0">
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
        <li v-for="game of games" :key="game.id">
          <MainGameCard :content="game" />
        </li>
      </ul>
      <div
        v-if="games.length === 6"
        class="flex w-full items-center justify-center pt-8"
      >
        <NuxtLink :to="{ name: 'all' }">
          <button
            class="bg-gradient-to-tl from-indigo-900 to-fuchsia-700 px-9 py-2 text-3xl rounded shadow md:hover:scale-110 transition-all duration-75"
          >
            See All
          </button>
        </NuxtLink>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-else class="flex justify-center items-center h-56">
      <h1 v-if="errorMsg" class="text-3xl font-bold text-red-100">
        {{ errorMsg }}
      </h1>
      <h1 v-else class="text-3xl font-bold">There is empty...</h1>
    </div>
  </div>
</template>
