<script setup lang="ts">
import { IPlatform } from "@workspace/shared";

const platformsStore = usePlatforms();

if (platformsStore.platforms.length <= 0) await platformsStore.getPlatforms();

const platforms = computed(() => platformsStore.platforms);
</script>

<template>
  <div class="sidemenu-platforms m-2">
    <h2 class="platforms pt-2 pl-2 font-bold text-2xl">Platforms</h2>
    <ul class="platforms-list flex flex-col gap-2 text-xl pl-8 py-5">
      <li
        class="flex flex-col w-full"
        v-for="platform of platforms"
        :key="platform.id"
      >
        <NuxtLink
          :class="[
            'hover:bg-gradient-to-r from-blue-900 to-blue-800 rounded-md py-2 pl-5 mr-6 inline select-none cursor-pointer transition-all duration-75 ease-in-out',
            useRoute().query.platform === platform.name
              ? 'bg-gradient-to-r from-blue-900 to-blue-800'
              : '',
          ]"
          :to="{ name: 'all', query: { platform: platform.name } }"
        >
          {{ platform.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
