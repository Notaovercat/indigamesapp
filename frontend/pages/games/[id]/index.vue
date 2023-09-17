<script setup lang="ts">
definePageMeta({
  name: "game-id",
});
import { IGame } from "@workspace/shared";

const route = useRoute();

const useGameStore = useGames();

const gameId = route.params.id as string;

await useGameStore.getGameById(gameId);

const game = useGameStore.game as IGame;

useHead({
  title: game.title,
});
</script>

<template>
  <div
    class="game-page max-w-7xl bg-[#241468] text-white overflow-hidden mx-auto flex flex-col my-5 rounded-lg"
  >
    <GamesGameInfo :content="game" />
  </div>
</template>
types/game.interface
