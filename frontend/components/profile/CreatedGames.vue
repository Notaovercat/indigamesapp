<script setup lang="ts">
const profileStore = useProfile();
const data = computed(() => profileStore.profileGames);
const errorMsg = computed(() => profileStore.gameErrorMsg);
const isLoading = computed(() => profileStore.gameLoading);
</script>
<template>
  <div class="flex flex-col gap-2 px-2 w-full h-full">
    <div v-if="errorMsg" class="w-full text-xl text-center">
      <p>{{ errorMsg }}</p>
    </div>
    <div v-else-if="isLoading" class="flex justify-center items-center w-full">
      <LoadingSpinner />
    </div>
    <div class="flex flex-col gap-3" v-else-if="data.length > 0">
      <ProfileGameCard
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
    </div>
    <div
      v-else
      class="flex items-center justify-center w-full py-9 text-3xl font-bold"
    >
      <p>There are no games</p>
    </div>
  </div>
</template>
