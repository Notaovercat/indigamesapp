<script setup lang="ts">
import { EyeIcon, StarIcon } from "@heroicons/vue/20/solid";
interface Props {
  rating: number;
  views_count: number;
}

const { rating, views_count } = defineProps<Props>();
</script>

<template>
  <div class="flex gap-7">
    <div>
      <button v-for="i in 5" :class="{ 'mr-1': i < 5 }">
        <StarIcon
          class="h-8 w-8"
          :class="[rating >= i ? 'text-yellow-500' : 'text-gray-500']"
        />
      </button>
    </div>

    <div class="flex text-gray-200 justify-center items-center gap-3">
      <EyeIcon class="h-5 w-5" /> {{ views_count }}
    </div>
  </div>
</template>
