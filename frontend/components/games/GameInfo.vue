<script setup lang="ts">
import { IGame } from "@/types/games/game.interface";
import { EyeIcon, StarIcon, WrenchIcon } from "@heroicons/vue/20/solid";

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
        <div class="game-description">
          <!-- TITLE -->
          <h1 class="game-title flex font-bold text-4xl pt-6 gap-4">
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
          <div class="p-7 gap-7 flex">
            <div>
              <button v-for="i in 5" :class="{ 'mr-1': i < 5 }">
                <StarIcon
                  class="h-8 w-8"
                  :class="[
                    content.rating >= i ? 'text-yellow-500' : 'text-gray-500',
                  ]"
                />
              </button>
            </div>

            <div class="flex text-gray-200 justify-center items-center gap-3">
              <EyeIcon class="h-5 w-5" /> {{ content.views_count }}
            </div>
          </div>

          <!-- DESCRIPTON -->
          <div class="description py-2 pl-3 text-xl leading-9">
            {{ content.description }}
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
