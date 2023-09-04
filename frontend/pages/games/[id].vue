<script setup lang="ts">
import { IGame } from "@/types/games/game.interface";

const route = useRoute();

const gameStore = useGames();

const gameId = route.params.id as string;

const game = (await gameStore.getGameById(gameId)) as IGame;

if (!game) showError({ statusCode: 404, statusMessage: "Page Not Found" });

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
