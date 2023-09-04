<script setup lang="ts">
import { MenuButton } from "@headlessui/vue";
import { UserIcon } from "@heroicons/vue/20/solid";
</script>
<template>
  <MenuButton
    class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
  >
    <UserIcon class="h-8 w-8" aria-hidden="true" />
  </MenuButton>
</template>
