<script setup lang="ts">
import { IGameCard } from "@workspace/shared";

interface Props {
  game: IGameCard;
}

const { game } = defineProps<Props>();
</script>

<template>
  <div
    class="sm:flex bg-[#35157f] text-white rounded p-2 shadow-xl cursor-pointer select-none hover:bg-[#472399] transition-all"
  >
    <div class="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
      <ProfileCardImg :cover-name="game.coverImage?.name" />
    </div>
    <div class="flex flex-col gap-1 text-lg">
      <h4 class="text-xl font-bold">{{ game.title }}</h4>
      <p v-dompurify-html="game.description" class="mt-1 line-clamp-1"></p>
      <p>Rating: {{ game.rating * 2 }}/10</p>
      <p>Views: {{ game.views_count }}</p>
      <p>Comments: {{ game._count.comments }}</p>
    </div>
  </div>
</template>
