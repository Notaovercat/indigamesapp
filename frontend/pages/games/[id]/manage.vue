<script setup lang="ts">
definePageMeta({
  name: "game-id-manage",
  middleware: ["auth-check"],
});
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  PhotoIcon,
  Cog6ToothIcon,
  WindowIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/vue/24/outline";
import { IGame } from "@workspace/shared";

const categories = reactive([
  {
    id: 1,
    name: "Screenshots",
    icon: PhotoIcon,
  },
  {
    id: 2,
    name: "Content",
    icon: WindowIcon,
  },
  {
    id: 3,
    name: "Configure",
    icon: Cog6ToothIcon,
  },
]);

const route = useRoute();

// game
const useGameStore = useGames();

const gameId = route.params.id as string;

let game = {} as unknown as IGame;

const { data, error } = await useMyFetch<IGame>(`games/my/${gameId}`);

if (error.value) {
  showError({
    statusCode: error.value.statusCode,
    message: error.value.message,
  });
}

if (data.value) game = data.value;

const openGoBack = ref(false);

useHead({
  title: `${game.title} - Manage`,
});
</script>

<template>
  <div
    class="game-page max-w-7xl bg-[#241468] text-white overflow-hidden mx-auto flex flex-col my-5 rounded-lg"
  >
    <TabGroup
      as="div"
      vertical
      class="grid grid-cols-1 md:grid-cols-4 h-full gap-2"
    >
      <!-- SIDEBAR -->
      <TabList
        as="ul"
        class="col-span-1 w-full h-full flex flex-col px-3 gap-3"
      >
        <div class="flex flex-col text-center justify-center py-8">
          <h1 class="text-3xl font-bold">Manage Game</h1>
          <h2 class="text-2xl font-md">{{ game.title }}</h2>
        </div>
        <Tab
          as="li"
          v-slot="{ selected }"
          v-for="cat in categories"
          :key="cat.id"
          class="w-full focus:outline-none"
        >
          <button
            :class="[
              'w-full rounded-lg py-2.5 text-2xl gap-3 leading-5 flex p-2 items-center',
              selected
                ? 'shadow-xl bg-[#130a3a] '
                : 'text-white hover:bg-[#130a3a] ',
            ]"
          >
            <component
              :is="cat.icon"
              class="h-6 w-6 shrink-0"
              aria-hidden="true"
            />
            {{ cat.name }}
          </button>
        </Tab>

        <li>
          <button
            @click="openGoBack = true"
            class="'w-full rounded-lg py-2.5 text-2xl gap-3 leading-5 flex items-center p-2 text-white hover:bg-[#130a3a] w-full"
          >
            <ArrowUturnLeftIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
            Go Back
          </button>
        </li>
      </TabList>

      <!-- GAME -->
      <div class="col-span-3 min-h-screen">
        <div
          class="min-h-screen data-page text-black overflow-hidden mx-auto flex flex-col rounded-lg py-2 md:py-0 md:pl-2"
        >
          <div
            class="min-h-screen bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-e-xl w-full"
          >
            <TabPanels>
              <TabPanel>
                <ManageImages
                  :game-id="game.id"
                  :cover-image="game.coverImage"
                  :screenshots="game.screenshots"
                />
              </TabPanel>
              <TabPanel>
                <ManageData :game="game" />
              </TabPanel>
              <TabPanel> <ManageConfigure :game="game" /> </TabPanel>
            </TabPanels>
          </div>
        </div>
      </div>
    </TabGroup>
  </div>

  <!-- GO BACK WINDOW -->
  <TransitionRoot as="template" :show="openGoBack">
    <Dialog
      as="div"
      class="relative z-10"
      :open="openGoBack"
      @close="openGoBack = false"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <ArrowUturnLeftIcon
                    class="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Go Back</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to go back? All your changes will
                      lost.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <NuxtLink
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  :to="{
                    name: game.isVisible ? 'game-id' : 'my-game-id',
                    params: { id: game.id },
                  }"
                >
                  Go Back
                </NuxtLink>
                <button
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="openGoBack = false"
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
