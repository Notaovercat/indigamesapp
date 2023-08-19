<script setup lang="ts">
interface Props {
  content: IGamePreview;
}

import { IGamePreview } from "@/types/gamePreview";

const props = defineProps<Props>();

const { content } = props;
</script>

<template>
  <NuxtLink
    class="game-card relative shadow-xl bg-white rounded-xl w-64 h-[350px] shrink-0 overflow-y-hidden flex flex-col cursor-pointer select-none hover:scale-110 transition-all"
    :to="{ name: 'games-id', params: { id: content.id } }"
  >
    <img
      class="game-image h-36 w-full object-top"
      :src="
        content.coverImage
          ? `http://localhost:3000/images/${content.coverImage.name}`
          : undefined
      "
      alt="gameCover"
    />

    <div class="card-info px-2 pt-1 pb-0 flex flex-col gap-3">
      <h1 class="card-title text-3xl font-bold text-black">
        {{ content.title }}
      </h1>
      <p class="card-desc pl-2 text-base line-clamp-3 text-gray-800">
        {{ content.description }}
      </p>
      <ul class="flex p-2 absolute bottom-0 right-0">
        <li v-for="genre of content.genres" class="text-2xl text-black">
          <span>{{ genre.name }}</span>
        </li>
      </ul>
    </div>
  </NuxtLink>
</template>
