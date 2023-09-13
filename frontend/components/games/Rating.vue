<script setup lang="ts">
import { ArrowPathIcon, EyeIcon, StarIcon } from "@heroicons/vue/20/solid";
interface Props {
  rating: number;
  rating_cound: number;
  views_count: number;
}

const isLoading = ref(false);

const value = ref(0);

const props = defineProps<Props>();
const rating = ref(props.rating);
const rating_cound = ref(props.rating_cound);
const views_count = ref(props.views_count);

const handleRating = async (val: number) => {
  isLoading.value = true;

  const { data } = await useMyFetch<number>(
    `games/${useRoute().params.id}/rating`,
    {
      method: "PATCH",
      body: {
        rating: val,
      },
    }
  );

  if (data.value) rating.value = data.value;

  isLoading.value = false;
};
</script>

<template>
  <div class="flex gap-7">
    <div class="flex relative">
      <button
        v-for="i in 5"
        :key="i"
        @click="handleRating(i)"
        @mouseenter="value = i"
        @mouseleave="value = 0"
        :disabled="!useAuth().isAuthed"
        class="relative"
      >
        <StarIcon
          class="h-8 w-8"
          :class="[
            rating >= i || value >= i ? 'text-yellow-500' : 'text-gray-500',
            'disabled:opacity-50 ',
            { 'hover:text-yellow-500': i },
          ]"
        />
      </button>
      <div
        v-if="isLoading"
        class="absolute flex justify-center items-center w-full h-full bg-white opacity-50"
      >
        <ArrowPathIcon
          class="text-black h-full animate-spin absolute left-1/2 right-1/2"
        />
      </div>
      <div class="flex pl-2 text-gray-300 text-xl justify-center items-center">
        <p>({{ rating_cound }})</p>
      </div>
    </div>

    <div class="flex text-gray-200 justify-center items-center gap-3">
      <EyeIcon class="h-5 w-5" /> {{ views_count }}
    </div>
  </div>
</template>
