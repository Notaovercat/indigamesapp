<script setup lang="ts">
import {
  CheckIcon,
  ChevronUpDownIcon,
  FolderArrowDownIcon,
} from "@heroicons/vue/20/solid";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { IGenre } from "@/types/genre/genre.interface";
import { IPlatform } from "@/types/platform/platform.interface";
import { IGame } from "@/types/games/game.interface";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

interface Props {
  game: IGame;
}

const useGenreStore = useGenres();
const usePlatformStore = usePlatforms();

if (useGenreStore.genres.length <= 0 || usePlatformStore.platforms.length <= 0)
  await Promise.all([
    useGenreStore.getGenres(),
    usePlatformStore.getPlatforms(),
  ]);

// dialog to save changes
const openSave = ref(false);

// game form
const { game } = defineProps<Props>();

// genres
const genres: Ref<IGenre[]> = ref(useGenreStore.genres);

// select genres that already in game
const selectedGenre = ref<IGenre[]>([
  ...useGenreStore.genres.filter((genre) =>
    game.genres.some((gamegenre) => genre.id === gamegenre.id)
  ),
]);
const genresErrorMsg = ref("");

// plarforms
const platforms: Ref<IPlatform[]> = ref(usePlatformStore.platforms);
const selectedPlatforms = ref<IPlatform[]>([
  ...usePlatformStore.platforms.filter((platform) =>
    game.platforms.some((gameplatform) => platform.id === gameplatform.id)
  ),
]);
const platformsErrorMsg = ref("");

// tags
const tags: Ref<string> = ref(game.tags.map((item) => item.name).join(", "));

// create game function
const cgErrorMsg = ref("");
const titleErrorMsg = ref("");
const descErrorMsg = ref("");
const isError = ref(false);
const successfulMessage = ref("");

const saveChanges = async () => {
  genresErrorMsg.value = "";
  platformsErrorMsg.value = "";
  cgErrorMsg.value = "";
  titleErrorMsg.value = "";
  descErrorMsg.value = "";
  isError.value = false;
  successfulMessage.value = "";

  if (!game.title) {
    titleErrorMsg.value = "Please, provide title";
    isError.value = true;
  }

  if (!game.description) {
    descErrorMsg.value = "Please, provide description";
    isError.value = true;
  }

  if (selectedGenre.value.length === 0) {
    genresErrorMsg.value = "Pleas, select genres";
    isError.value = true;
  }

  if (selectedPlatforms.value.length === 0) {
    platformsErrorMsg.value = "Please, select platforms";
    isError.value = true;
  }

  if (isError.value) return;

  const updatedGame = {
    title: game.title,
    description: game.description,
    genres: selectedGenre.value.map((genre) => genre.id),
    platforms: selectedPlatforms.value.map((platforms) => platforms.id),
    tags: tags.value
      .split(",")
      .map((tag) => tag.trim().replace(/[\s]+/g, "-").toLowerCase())
      .filter((tag) => tag.length !== 0),
  };

  const { data, error } = await useMyFetch(`games/${game.id}`, {
    method: "PATCH",
    body: updatedGame,
  });

  if (error.value) {
    console.log(error.value);
    cgErrorMsg.value = "Error while game updating, please, try again later";
  }
  if (data.value) {
    // useRouter().push({ name: "game-id-manage", params: { id: game.id } });
    successfulMessage.value = "Chages are successfully saved";
  }

  openSave.value = false;
};
</script>

<template>
  <!-- INPUTS -->
  <div class="px-4 py-6 sm:p-8">
    <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <!-- TITLE -->
      <div class="sm:col-span-4">
        <label
          for="title"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Title <span class="text-red-600">*</span></label
        >
        <div class="mt-2">
          <div
            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
          >
            <input
              v-model="game.title"
              type="text"
              name="title"
              id="title"
              class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Title of your game"
            />
          </div>
        </div>

        <!-- ERROR MESSAGE -->
        <p class="text-sm text-red-600 pt-2">
          {{ titleErrorMsg }}
        </p>
      </div>

      <!-- DESCRIPTION -->
      <div class="col-span-full">
        <label
          for="description"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Description <span class="text-red-600">*</span></label
        >
        <div class="mt-2">
          <!-- <textarea
            v-model="game.description"
            id="description"
            name="description"
            rows="3"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          /> -->
          <ClientOnly>
            <QuillEditor
              theme="snow"
              v-model:content="game.description"
              content-type="html"
            />
          </ClientOnly>
        </div>
        <p class="mt-3 text-sm leading-6 text-gray-600">
          Write what is your game about.
        </p>

        <!-- ERROR MESSAGE -->
        <p class="text-sm text-red-600 pt-2">
          {{ descErrorMsg }}
        </p>
      </div>

      <!-- GENRES SELECT -->
      <div class="sm:col-span-4">
        <Listbox as="div" v-model="selectedGenre" multiple>
          <ListboxLabel
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Genres <span class="text-red-600">*</span>
          </ListboxLabel>
          <div class="relative mt-2">
            <ListboxButton
              class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 h-10"
            >
              <span class="block truncate">
                {{ selectedGenre.map((genre) => genre.name).join(", ") }}</span
              >
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpDownIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  as="template"
                  v-for="genre in genres"
                  :key="genre.id"
                  :value="genre"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ genre.name }}</span
                    >

                    <span
                      v-if="selected"
                      :class="[
                        active ? 'text-white' : 'text-indigo-600',
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                      ]"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>

        <!-- ERROR MESSAGE -->
        <p class="text-sm text-red-600 pt-2">
          {{ genresErrorMsg }}
        </p>
      </div>

      <!-- PLATFORMS SELECT -->
      <div class="sm:col-span-4">
        <Listbox as="div" v-model="selectedPlatforms" multiple>
          <ListboxLabel
            class="block text-sm font-medium leading-6 text-gray-900"
            >Platforms <span class="text-red-600">*</span></ListboxLabel
          >
          <div class="relative mt-2">
            <ListboxButton
              class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 h-10"
            >
              <span class="block truncate">
                {{
                  selectedPlatforms.map((genre) => genre.name).join(", ")
                }}</span
              >
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpDownIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  as="template"
                  v-for="platform in platforms"
                  :key="platform.id"
                  :value="platform"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ platform.name }}</span
                    >

                    <span
                      v-if="selected"
                      :class="[
                        active ? 'text-white' : 'text-indigo-600',
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                      ]"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>

        <!-- ERROR MESSAGE -->
        <p class="text-sm text-red-600 p-2">
          {{ platformsErrorMsg }}
        </p>
      </div>

      <!-- TAGS -->
      <div class="sm:col-span-4">
        <label
          for="tags"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Tags</label
        >
        <div class="mt-2 rounded-md shadow-sm">
          <input
            v-model="tags"
            type="text"
            name="tags"
            id="tags"
            class="block h-10 w-full rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <p class="mt-1 text-sm leading-6 text-gray-600">Write with a comma.</p>
      </div>
    </div>
  </div>

  <!-- BUTTONS -->
  <div
    class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
  >
    <button type="button" class="text-sm font-semibold leading-6 text-gray-900">
      Cancel
    </button>
    <button
      @click="openSave = true"
      type="submit"
      class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Save
    </button>
  </div>
  <div v-if="cgErrorMsg" class="flex justify-center items-center p-3">
    <p class="text-sm text-red-600 pt-2">
      {{ cgErrorMsg }}
    </p>
  </div>
  <div v-if="successfulMessage" class="flex justify-center items-center p-3">
    <p class="text-sm text-green-600 pt-2">
      {{ successfulMessage }}
    </p>
  </div>

  <!-- SAVE BUTTON -->
  <TransitionRoot as="template" :show="openSave">
    <Dialog
      as="div"
      class="relative z-10"
      :open="openSave"
      @close="openSave = false"
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
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <FolderArrowDownIcon
                    class="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Save changes</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to save the changes?
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  @click="saveChanges"
                >
                  Save
                </button>
                <button
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="openSave = false"
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
