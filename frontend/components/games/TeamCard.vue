<script setup lang="ts">
import { UserIcon, XMarkIcon } from "@heroicons/vue/20/solid";
interface Props {
  userId: string;
  username: string;
  role: string;
  isManage: boolean;
}

const { role, username, isManage, userId } = defineProps<Props>();

const emit = defineEmits(["delete"]);

const onDelete = () => {
  emit("delete", userId);
};
</script>

<template>
  <div
    class="group flex bg-gradient-to-l from-violet-500 via-purple-700 to-violet-900 shadow text-white overflow-hidden rounded-lg"
  >
    <div class="flex justify-center items-center px-3">
      <UserIcon class="w-10 bg-slate-400 rounded-full" />
    </div>

    <div class="flex flex-col gap-2 p-4">
      <NuxtLink
        class="font-bold transition-all cursor-pointer hover:text-slate-300"
        :to="{ name: 'profile', params: { id: userId } }"
      >
        {{ username }}
      </NuxtLink>
      <p><span class="font-bold pr-1">Role:</span>{{ role }}</p>
    </div>

    <button
      v-if="isManage"
      @click="onDelete"
      class="px-3 flex bg-red-600 hover:bg-red-500 text-black items-center transition-colors"
    >
      <XMarkIcon class="h-5 w-5" />
    </button>
  </div>
</template>
