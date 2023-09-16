<script setup lang="ts">
interface Props {
  name: string;
  path: string;
}

const { name, path } = defineProps<Props>();
</script>
<template>
  <NuxtLink
    :to="{ name: path }"
    class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-[#EA1179] hover:text-white"
  >
    {{ name }}
  </NuxtLink>
</template>
