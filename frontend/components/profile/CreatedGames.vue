<script setup lang="ts">
const profileStore = useProfile();
const data = computed(() => profileStore.profileGames);
const errorMsg = computed(() => profileStore.gameErrorMsg);
const isLoading = computed(() => profileStore.gameLoading);
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
      @click="
        navigateTo({
          name: game.isVisible ? 'game-id' : 'my-game-id',
          params: { id: game.id },
        })
      "
    />
    <div
      v-else
      class="game-empty flex items-center justify-center w-full py-9 text-3xl font-bold"
    >
      <p>There are no games</p>
    </div>
  </div>
</template>
