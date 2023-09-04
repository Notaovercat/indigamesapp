<script setup lang="ts">
import { IUserTeams } from "@/types/profile/userTeams.interface";

interface Props {
  userTeam: IUserTeams;
}

const { userTeam } = defineProps<Props>();
const config = useRuntimeConfig();
const { API_URL } = config.public;
</script>

<template>
  <div class="sm:flex bg-[#35157f] text-white p-2 shadow-xl rounded">
    <div class="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
      <img
        class="h-32 w-full rounded bg-white text-gray-300 sm:w-32"
        :src="
          userTeam.team.game.coverImage
            ? `${API_URL}/images/${userTeam.team.game.coverImage.name}`
            : 'https://images.unsplash.com/photo-1498736297812-3a08021f206f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1779&q=80'
        "
      />
    </div>
    <div class="flex flex-col gap-1 text-lg">
      <h4 class="text-xl font-bold">{{ userTeam.role }}</h4>
      <p class="mt-1">Game: {{ userTeam.team.game.title }}</p>
      <p>Game author: {{ userTeam.team.author.username }}</p>
    </div>
  </div>
</template>
