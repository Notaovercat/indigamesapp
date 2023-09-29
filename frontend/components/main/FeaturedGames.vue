<script setup lang="ts">
const gameStore = useGames();

if (gameStore.featuredGames.length <= 0) await gameStore.getFeaturedGames();

const games = computed(() => gameStore.featuredGames);

const errorMsg = ref(gameStore.errorMsg);
</script>

<template>
  <h1 class="pb-4 pt-2 pl-2 font-bold text-3xl text-center md:text-start">
    Featured Games
  </h1>
  <div
    class="relative flex flex-col w-full items-start justify-center gap-5 overflow-x-scroll md:overflow-x-hidden"
    v-if="games.length > 0"
  >
    <ul
      v-if="games?.length > 0"
      class="flex md:grid md:grid-cols-2 lg:grid-cols-3 w-auto pl-4 pt-9 gap-9 pb-8"
    >
      <li v-for="game of games" :key="game.id">
        <MainGameCard :content="game" />
      </li>
    </ul>
  </div>
  <div v-else class="flex justify-center items-center h-56">
    <h1 v-if="errorMsg" class="text-3xl font-bold text-red-100">
      {{ errorMsg }}
    </h1>
    <h1 v-else class="text-3xl font-bold">Wait for the updates</h1>
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
