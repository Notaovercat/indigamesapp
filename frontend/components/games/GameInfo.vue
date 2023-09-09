<script setup lang="ts">
import { IGame } from "@/types/games/game.interface";

const config = useRuntimeConfig();
const { API_URL } = config.public;

interface Props {
  content: IGame;
}

const { content } = defineProps<Props>();
</script>

<template>
  <GamesCoverImage :coverImageName="content.coverImage?.name" />
  <div class="game-main rounded-xl m-1">
    <div class="game-info grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
      <div class="col-span-2 flex flex-col gap-7">
        <div class="game-description">
          <NuxtLink
            class="blocx bg-pink-900 text-white p-3 rounded shadow"
            v-if="useAuth().userId === content.team.author.id"
            :to="`${$route.params.id}/manage`"
          >
            Manage
          </NuxtLink>

          <h1 class="game-title font-bold text-5xl pl-5 pt-6">
            {{ content.title }}
          </h1>
          <div class="description py-2 px-9 text-2xl leading-9">
            {{ content.description }}
          </div>
        </div>
        <GamesDownload />
        <GamesComments />
      </div>

      <div class="game-additional flex flex-col h-auto">
        <div class="screenshots bg-[#332088] rounded-lg shadow-lg">
          <h2 class="text-2xl pl-2 pt-2">Screenshots</h2>
          <ul class="flex flex-col items-center gap-3 p-4">
            <li v-for="screen of content.screenshots" :key="screen.id">
              <img
                class="h-auto max-w-full rounded-lg shadow-2xl cursor-pointer"
                :src="`${API_URL}/images/${screen.name}`"
                alt="screenshot"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
