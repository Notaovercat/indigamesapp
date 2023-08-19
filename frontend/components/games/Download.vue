<script setup lang="ts">
import { ArrowDownIcon } from "@heroicons/vue/20/solid";
</script>

<template>
  <div class="download pl-9 pb-5 flex items-center">
    <button
      type="button"
      class="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <ArrowDownIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
      Download
    </button>
    <span class="pl-5 text-xl truncate">game_installer.exe</span>
  </div>
</template>
