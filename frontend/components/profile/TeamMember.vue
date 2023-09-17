<script setup lang="ts">
import { IUserTeams } from "@workspace/shared";

// OLD
// interface Props {
//   userId: string;
//   isYourProfile: boolean;
// }

// const { userId, isYourProfile } = defineProps<Props>();

// const useProfileStore = useProfile();

// const { data, error } = await useProfileStore.getProfileTeams(
//   userId,
//   isYourProfile
// );

const useProfileStore = useProfile();
const data = ref<IUserTeams[]>([]);
const errorMsg = ref("");
const isLoading = ref(false);

// WATCH PINIA DATA
watch(
  () => useProfileStore.profileTeams,
  () => (data.value = useProfileStore.profileTeams),
  { immediate: true }
);

watch(
  () => useProfileStore.teamErrorMsg,
  () => (errorMsg.value = useProfileStore.teamErrorMsg)
);

watch(
  () => useProfileStore.teamLoading,
  () => (isLoading.value = useProfileStore.teamLoading)
);
</script>
<template>
  <div class="games-container flex flex-col gap-2 px-2 w-full">
    <div v-if="errorMsg" class="game-error w-full text-xl text-center">
      <p>Please, try again later</p>
    </div>
    <div
      v-else-if="isLoading"
      class="game-loading flex justify-center items-center w-full"
    >
      <LoadingSpinner />
    </div>
    <ProfileTeamCard
      v-else-if="data.length > 0"
      v-for="userTeam of data"
      :userTeam="userTeam"
      :key="userTeam.id"
    />
    <div
      v-else
      class="game-empty flex items-center justify-center w-full py-9 text-3xl font-bold"
    >
      <p>You are not a member of any team</p>
    </div>
  </div>
</template>
