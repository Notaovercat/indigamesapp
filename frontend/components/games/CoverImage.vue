<script setup lang="ts">
interface Props {
  coverImageName?: string;
}

const { coverImageName } = defineProps<Props>();

const config = useRuntimeConfig();
const { API_URL } = config.public;
</script>
<template>
  <img
    class="game-cover w-full object-cover h-96"
    :src="
      coverImageName
        ? `${API_URL}/images/${coverImageName}`
        : 'https://images.unsplash.com/photo-1498736297812-3a08021f206f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1779&q=80'
    "
  />
</template>
