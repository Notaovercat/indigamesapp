<script setup lang="ts">
import { IGamePreview } from "@workspace/shared";

interface Props {
  content: IGamePreview;
}
const config = useRuntimeConfig();
const { API_URL } = config.public;

const props = defineProps<Props>();

const { content } = props;
</script>

<template>
  <NuxtLink
    class="game-card relative shadow-xl bg-gradient-to-t from-blue-900 via-purple-900 to-purple-800 rounded-xl w-64 h-96 shrink-0 overflow-y-hidden flex flex-col cursor-pointer select-none hover:scale-110 transition-all"
    :to="{ name: 'game-id', params: { id: content.id } }"
  >
    <img
      class="h-44 w-full object-cover object-left"
      v-if="content.coverImage"
      :src="`${API_URL}/images/${content.coverImage.name}`"
      alt="gameCover"
    />

    <img
      v-else
      class="h-44 w-full object-cover object-left"
      src="../../assets/images/cover.png"
      alt="noGameCover"
    />

    <div class="card-info px-2 pt-1 pb-0 flex flex-col gap-3">
      <h1 class="card-title text-3xl font-bold text-white">
        {{ content.title }}
      </h1>
      <p
        v-dompurify-html="content.description"
        class="card-desc pl-2 text-base line-clamp-3 text-slate-200"
      ></p>
      <ul class="flex gap-2 pb-2 pr-2 absolute bottom-0 right-0">
        <li
          v-for="(genre, i) of content.genres"
          :key="genre.id"
          class="flex text-base text-white"
        >
          <p>{{ genre.name }}</p>
          <span :class="[i === content.genres.length - 1 ? 'hidden' : '']"
            >,</span
          >
        </li>
      </ul>
    </div>
  </NuxtLink>
</template>
types/gamePreview.interface
