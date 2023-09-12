<script setup lang="ts">
import { IUserTeams } from "@/types/profile/userTeams.interface";

interface Props {
  userTeam: IUserTeams;
}

const { userTeam } = defineProps<Props>();
</script>

<template>
  <div class="sm:flex bg-[#35157f] text-white p-2 shadow-xl rounded">
    <div class="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
      <ProfileCardImg :cover-name="userTeam.team.game.coverImage?.name" />
    </div>
    <div class="flex flex-col gap-1 text-lg">
      <h4 class="text-xl font-bold">{{ userTeam.role }}</h4>
      <p class="mt-1">Game: {{ userTeam.team.game.title }}</p>
      <p>Game author: {{ userTeam.team.author.username }}</p>
    </div>
  </div>
</template>
