<script setup lang="ts">
import { ITeam } from "@/types/games/game.interface";

interface Props {
  team: ITeam;
}

const { team } = defineProps<Props>();
</script>

<template>
  <div class="mt-2 mb-4 mx-2">
    <div class="">
      <NuxtLink
        :to="{
          name: 'profile',
          params: { id: team.author.id },
        }"
        class="text-2xl flex gap-2"
      >
        <span class="">By</span>
        <span class="hover:text-[#ea1179] font-bold transition-all">
          {{ team.author.username }}
        </span>
      </NuxtLink>
    </div>

    <div v-if="team.team_members.length > 0">
      <p class="p-3 text-xl font-bold">Team:</p>
      <ul class="hidden md:grid grid-cols-3 bg-[#34218a86] py-2 gap-2 rounded">
        <li v-for="member in team.team_members" class="bg-purple-700">
          <GamesTeamCard
            :user-id="member.id"
            :is-manage="false"
            :username="member.user.username"
            :role="member.role"
          />
        </li>
      </ul>

      <details class="flex flex-col sm:hidden">
        <summary>Show Team</summary>

        <ul class="flex flex-col md:hidden bg-[#34218a86] p-2 gap-2 rounded">
          <li v-for="member in team.team_members">
            <GamesTeamCard
              :user-id="member.id"
              :is-manage="false"
              :username="member.user.username"
              :role="member.role"
            />
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>

<!-- <div class="flex items-center gap-x-6 p-2 bg-purple-700 text-white">
	<div>
		<UserIcon class="h-8 w-8 rounded-full" />
	</div>
	<div>
		<h3 class="text-base font-semibold leading-7 tracking-tight">
			{{ person.name }}
		</h3>
		<p class="text-sm font-semibold leading-6 text-pink-500">
			 {{ person.role }}
		</p>
	</div>
</div> -->
