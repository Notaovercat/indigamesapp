<script setup lang="ts">
import { IGame } from "@/types/games/game.interface";
import { WrenchIcon } from "@heroicons/vue/20/solid";
import { STATUS } from "@/types/games/game.interface";

interface Props {
  content: IGame;
}

const { content } = defineProps<Props>();
</script>

<template>
  <div class="relative pb-8 md:pb-0">
    <GamesCoverImage :coverImageName="content.coverImage?.name" />
  </div>
  <div class="game-main rounded-xl m-1">
    <div class="game-info grid grid-cols-1 md:grid-cols-3 md:gap-4 md:p-5">
      <div class="col-span-2 flex flex-col gap-7">
        <div class="game-description flex flex-col">
          <!-- TITLE -->
          <h1
            class="game-title flex justify-center sm:justify-start font-bold text-4xl pt-6 gap-4"
          >
            {{ content.title }}

            <!-- MANAGE BUTTON -->
            <NuxtLink
              class="block z-20 bg-black hover:bg-slate-800 transition-all text-white p-3 rounded shadow-xl text-sm"
              v-if="useAuth().userId === content.team.author.id"
              :to="`${$route.params.id}/manage`"
            >
              <div class="flex justify-center items-center gap-2">
                <WrenchIcon class="h-5 w-5" /> Manage
              </div>
            </NuxtLink>
          </h1>

          <!-- RATING and views -->
          <div class="px-7 pt-4 pb-5">
            <GamesRating
              :views_count="content.views_count"
              :rating="content.rating"
              :rating_cound="content._count.rated"
            />
          </div>

          <!-- STATUS -->
          <div
            v-if="content.status !== STATUS.NonProvided"
            class="text-2xl py-3"
          >
            <GamesStatus :status="content.status" />
          </div>

          <!-- GENRE -->
          <div class="flex gap-3 text-2xl py-3">
            <p>Genres:</p>
            <ul class="flex flex-col gap-y-1">
              <NuxtLink
                class="text-pink-300 font-bold hover:text-[#ea1179] transition-all cursor-pointer"
                v-for="genre of content.genres"
              >
                {{ genre.name }}
              </NuxtLink>
            </ul>
          </div>

          <!-- PLATFORMS -->
          <div class="flex gap-3 text-2xl py-3">
            <p>Platfrorms:</p>
            <ul class="flex flex-col gap-y-1">
              <NuxtLink
                class="text-pink-300 font-bold hover:text-[#ea1179] transition-all cursor-pointer"
                v-for="platform of content.platforms"
              >
                {{ platform.name }}
              </NuxtLink>
            </ul>
          </div>

          <!-- TEAM -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full sm:w-1/2 border-t border-white" />
            </div>
            <div class="relative flex justify-center sm:justify-start sm:pl-2">
              <span
                class="bg-[#241468] px-3 text-lg font-semibold leading-6 text-white rounded"
              >
                Author
              </span>
            </div>
          </div>
          <GamesTeam :team="content.team" />

          <!-- DESCRIPTON -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full sm:w-1/2 border-t border-white" />
            </div>
            <div class="relative flex justify-center sm:justify-start sm:pl-2">
              <span
                class="bg-[#241468] px-3 text-lg font-semibold leading-6 text-white rounded"
              >
                About the game
              </span>
            </div>
          </div>
          <div class="description py-2 pl-3 text-xl leading-9">
            <div v-dompurify-html="content.description"></div>
          </div>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full sm:w-1/2 border-t border-white" />
          </div>
          <div class="relative flex justify-center sm:justify-start sm:pl-2">
            <span
              class="bg-[#241468] px-3 text-lg font-semibold leading-6 text-white rounded"
            >
              Download
            </span>
          </div>
        </div>
        <GamesDownload />
        <GamesComments />
      </div>

      <div class="game-additional overflow-y-scroll pt-4">
        <!-- SCREENSHOTS -->
        <div class="screenshots">
          <h2 class="text-2xl pl-2 pt-2 text-center md:text-start">
            Screenshots
          </h2>
          <ul
            v-if="content.screenshots.length > 0"
            class="flex flex-col items-center gap-3 p-4 h-[20rem]"
          >
            <GamesScreenshot
              v-for="screen of content.screenshots"
              :key="screen.id"
              :screenName="screen.name"
              :screen-id="screen.id"
              :isManage="false"
            />
          </ul>
          <div
            v-else
            class="flex justify-center items-center h-[20rem] font-bold text-2xl"
          >
            <p>No screenshots provided</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar-track {
  background-color: #ea117a69;
  border-radius: 10px;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #ea1179;
}
</style>
