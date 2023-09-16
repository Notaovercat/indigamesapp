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
    class="rounded-md px-3 py-2 text-lg font-bold text-white bg-gradient-to-br from-blue-900 via-purple-900 to-purple-900 hover:bg-gradient-to-b hover:from-cyan-400 hover:bg-rose-700 transition-all ease-in-out shadow-xl"
  >
    {{ name }}
  </NuxtLink>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");
* {
  font-family: "Inter", sans-serif;
}
</style>
