<script setup lang="ts">
import { IGameCard } from "@/types/profile/gameCard.interface";

interface Props {
  game: IGameCard;
}

const { game } = defineProps<Props>();
const config = useRuntimeConfig();
const { API_URL } = config.public;
</script>

<template>
  <div class="sm:flex bg-[#35157f] text-white rounded p-2 shadow-xl">
    <div class="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
      <img
        class="h-32 w-full rounded-xl bg-white text-gray-300 sm:w-32"
        :src="
          game.coverImage
            ? `${API_URL}/images/${game.coverImage.name}`
            : 'https://images.unsplash.com/photo-1498736297812-3a08021f206f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1779&q=80'
        "
      />
    </div>
    <div class="flex flex-col gap-1 text-lg">
      <h4 class="text-xl font-bold">{{ game.title }}</h4>
      <p class="mt-1 line-clamp-1">
        {{ game.description }}
      </p>
      <p>Rating: {{ game.rating }}/10</p>
      <p>Views: {{ game.views_count }}</p>
      <p>Comments: {{ game._count.comments }}</p>
    </div>
  </div>
</template>
