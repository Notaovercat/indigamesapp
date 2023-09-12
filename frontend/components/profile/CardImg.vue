<script setup lang="ts">
interface Props {
  coverName?: string;
}
const config = useRuntimeConfig();
const { API_URL } = config.public;
const { coverName } = defineProps<Props>();
</script>

<template>
  <div class="flex overflow-hidden" v-if="coverName">
    <img
      class="object-contain rounded-sm text-gray-300 sm:w-64"
      :src="`${API_URL}/images/${coverName}`"
    />
  </div>

  <div class="flex overflow-hidden" v-else>
    <img
      class="object-contain rounded-sm text-gray-300 sm:w-64"
      src="../../assets/images/cover.png"
    />
  </div>
</template>
