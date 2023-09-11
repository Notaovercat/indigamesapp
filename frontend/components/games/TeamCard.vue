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
  <div class="flex bg-slate-100 rounded shadow text-black overflow-hidden">
    <div class="flex justify-center items-center bg-slate-200 px-3">
      <UserIcon class="w-10 bg-slate-400 rounded-full" />
    </div>

    <div class="flex flex-col gap-2 p-4">
      <p>{{ username }}</p>
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
