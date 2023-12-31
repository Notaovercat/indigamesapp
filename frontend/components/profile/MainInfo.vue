<script setup lang="ts">
import { UserIcon } from "@heroicons/vue/20/solid";
import { IProfile } from "@workspace/shared";

const profileStore = useProfile();
const data = computed(() => profileStore.profileInfo);
const errorMsg = computed(() => profileStore.profileErrorMsg);
const isLoading = computed(() => profileStore.gameLoading);

useHead({
  title: `Games - ${data.value?.username}'s Profile`,
});
</script>

<template>
  <div
    class="w-full md:h-[20rem] flex flex-col md:flex-row justify-between md:justify-start gap-4 p-2"
  >
    <!-- PROFILE INFO -->
    <div
      class="profile-info bg-[#241468] flex items-center justify-center p-2 h-full w-full md:w-auto rounded-xl shadow"
    >
      <div v-if="errorMsg" class="w-full text-xl text-center">
        <p>{{ errorMsg }}</p>
      </div>
      <div v-if="isLoading" class="flex justify-center items-center w-full">
        <LoadingSpinner />
      </div>
      <div
        v-if="data"
        class="flex flex-col md:text-3xl gap-3 items-center justify-center w-full h-full"
      >
        <UserIcon class="md:w-40 w-20 rounded-full" />
        <div class="flex justify-between gap-2">
          <span>{{ data.username }}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span class="text-slate-400">Email:</span>
          <span>{{ data.email }}</span>
        </div>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div
      class="py-5 px-1 overflow-y-scroll bg-scroll h-[20rem] md:h-full w-full"
    >
      <div v-if="errorMsg" class="w-full text-xl text-center">
        <p>{{ errorMsg }}</p>
      </div>
      <div v-if="isLoading" class="flex justify-center items-center w-full">
        <LoadingSpinner />
      </div>
      <p v-if="data" class="text-2xl">
        {{ data.description }}
      </p>
      <div v-else class="flex justify-center items-center w-full h-full">
        <p class="text-2xl">There is empty</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar-track {
  background-color: #241468;
  border-radius: 10px;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #861598;
}
</style>
