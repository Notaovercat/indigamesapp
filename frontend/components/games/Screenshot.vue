<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";

const open = ref(false);

interface Props {
  screenId: string;
  screenName: string;
  isManage: boolean;
}

const config = useRuntimeConfig();
const API_URL = config.public.API_URL;

const { screenName, isManage, screenId } = defineProps<Props>();
const manage = ref(isManage);

const emit = defineEmits(["delete"]);

const onDelete = () => {
  emit("delete", screenId);
};
</script>

<template>
  <div class="bg-white relative rounded-lg overflow-hidden shrink-0">
    <img
      @click="open = true"
      class="max-w-[20rem] max-h-[80rem] object-cover shrink-0 cursor-pointer hover:opacity-75 hover:shadow-2xl transition-all ease-in-out duration-75"
      :src="`${API_URL}/images/${screenName}`"
      alt="screenshot"
    />

    <button
      v-if="manage"
      @click="onDelete"
      class="absolute top-0 right-0 bg-red-600 text-white z-10 rounded-lg m-1"
    >
      <XMarkIcon class="h-8 w-8" />
    </button>
  </div>

  <div as="div" class="relative z-10" v-if="open">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75" />

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all"
        >
          <div>
            <div class="flex justify-center items-start p-2">
              <img
                :src="`${API_URL}/images/${screenName}`"
                alt="screenshot-full"
              />
            </div>
          </div>
          <div class="absolute top-0 right-0">
            <button
              type="button"
              class="w-full justify-center rounded-md text-slate-700 px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click="open = false"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
