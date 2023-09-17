<script setup lang="ts">
definePageMeta({
  name: "my-game-id",
});
import { IGame } from "@workspace/shared";

const route = useRoute();
const gameId = route.params.id as string;

const content = ref();

const { data, error } = await useMyFetch<IGame>(`games/my/${gameId}`);

if (error.value) {
  showError({
    statusCode: error.value.statusCode,
  });
}

if (data.value) content.value = data.value;
const title = content.value?.title;

useHead({
  title,
});
</script>

<template>
  <div
    class="game-page max-w-7xl bg-[#241468] text-white overflow-hidden mx-auto flex flex-col my-5 rounded-lg"
  >
    <GamesGameInfo v-if="content" :content="content" />
  </div>
</template>
