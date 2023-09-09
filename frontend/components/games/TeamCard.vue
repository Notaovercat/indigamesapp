<script setup lang="ts">
import { UserIcon } from "@heroicons/vue/20/solid";
interface Props {
  username: string;
  role: string;
}

const { role, username } = defineProps<Props>();
</script>

<template>
  <div
    class="flex bg-slate-100 rounded shadow text-black w-full shrink-0 overflow-hidden"
  >
    <div class="flex justify-center items-center bg-slate-500">
      <UserIcon class="w-9" />
    </div>

    <div class="flex flex-col gap-2 p-4 shrink-0 w-full">
      <p>Username: {{ username }}</p>
      <p>Role: {{ role }}</p>
    </div>
  </div>
</template>
