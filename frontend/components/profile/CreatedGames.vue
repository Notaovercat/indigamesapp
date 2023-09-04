<script setup lang="ts">
import { IGameCard } from "@/types/profile/gameCard.interface";

// OLD
// interface Props {
//   userId: string;
//   isYourProfile: boolean;
// }

// const { userId, isYourProfile } = defineProps<Props>();

// const useProfileStore = useProfile();

// const { data, error } = await useProfileStore.getProfileGames(
//   userId,
//   isYourProfile
// );

const useProfileStore = useProfile();
const data = ref<IGameCard[]>([]);
const errorMsg = ref("");
const isLoading = ref(false);

// WATCH PINIA DATA
watch(
  () => useProfileStore.profileGames,
  () => (data.value = useProfileStore.profileGames),
  { immediate: true }
);

watch(
  () => useProfileStore.gameErrorMsg,
  () => (errorMsg.value = useProfileStore.gameErrorMsg)
);

watch(
  () => useProfileStore.gameLoading,
  () => (isLoading.value = useProfileStore.gameLoading)
);
</script>
<template>
  <div class="games-container flex flex-col gap-2 px-2 w-full">
    <div v-if="errorMsg" class="game-error w-full text-xl text-center">
      <p>{{ errorMsg }}</p>
    </div>
    <div
      v-else-if="isLoading"
      class="game-loading flex justify-center items-center w-full"
    >
      <LoadingSpinner />
    </div>
    <ProfileGameCard
      v-else-if="data.length > 0"
      v-for="game of data"
      :game="game"
      :key="game.id"
    />
    <div
      v-else
      class="game-empty flex items-center justify-center w-full py-9 text-3xl font-bold"
    >
      <p>There are no games</p>
    </div>
  </div>
</template>
