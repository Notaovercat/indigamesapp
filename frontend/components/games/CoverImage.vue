<script setup lang="ts">
interface Props {
  coverImageName?: string;
}

const { coverImageName } = defineProps<Props>();

const config = useRuntimeConfig();
const { API_URL } = config.public;

// const placeholderImage = "https://images8.alphacoders.com/127/1274266.png";
</script>
<template>
  <div
    class="flex relative w-full overflow-hidden rounded select-none"
    v-if="!coverImageName"
  >
    <img
      class="game-cover object-fill h-80 pointer-events-none"
      src="../../assets/images/cover.png"
      alt="cover-image"
    />
  </div>

  <div v-else class="flex relative w-full overflow-hidden rounded">
    <img
      class="game-cover object-contain w-full h-80 relative z-10"
      :src="`${API_URL}/images/${coverImageName}`"
      alt="cover-image-bg"
    />

    <img
      class="absolute w-full h-80 object-cover blur-xl"
      :src="`${API_URL}/images/${coverImageName}`"
      alt="cover-image-bg"
    />
  </div>
</template>
<!-- 
:src="game-cover absolute w-full h-80 object-fill blur-2xl
        coverImageName
          ? `${API_URL}/images/${coverImageName}`
          : `../../assets/images/cover.png`
      " -->
