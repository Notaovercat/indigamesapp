<script setup lang="ts">
definePageMeta({
  name: "upload",
  middleware: ["auth-check"],
});
import {
  CheckIcon,
  ChevronUpDownIcon,
  UserPlusIcon,
} from "@heroicons/vue/20/solid";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
// @ts-ignore
import LazyList from "lazy-load-list/vue";
import { IGenre } from "@/types/genre/genre.interface";
import { ICreateGame } from "@/types/games/createGame.interface";
import { IPlatform } from "@/types/platform/platform.interface";
import { IUser } from "@/types/user/user.interface";

const useGenreStore = useGenres();
const usePlatformStore = usePlatforms();
const useUserStore = useUser();

await Promise.all([
  useGenreStore.getGenres(),
  usePlatformStore.getPlatforms(),
  useUserStore.getUsers(),
]);

// game form
const game = reactive<ICreateGame>({
  title: "",
  description: "",
  team: [],
  platforms: [],
  tags: [],
  genres: [],
});

// genres
const genres: Ref<IGenre[]> = ref([]);
const genresErrorMsg = ref("");

watch(
  () => useGenreStore.genres,
  () => (genres.value = useGenreStore.genres),
  { immediate: true }
);

const selectedGenre = ref<IGenre[]>([]);

// plarforms
const platforms: Ref<IPlatform[]> = ref([]);
const platformsErrorMsg = ref("");

watch(
  () => usePlatformStore.platforms,
  () => (platforms.value = usePlatformStore.platforms),
  { immediate: true }
);

const selectedplatforms = ref<IPlatform[]>([]);

// tags
const tags = ref("");

// users
const users: Ref<IUser[]> = ref([]);

watch(
  () => useUserStore.users,
  () => (users.value = useUserStore.users),
  { immediate: true }
);

const query = ref("");
const selectedPerson = ref<IUser>();
const filteredPeople = computed(() =>
  query.value === ""
    ? users.value
    : users.value.filter((person) => {
        return person.username
          .toLowerCase()
          .includes(query.value.toLowerCase());
      })
);

const team = ref<{ userId: string; role: string }[]>([]);
const teamErrorMsg = ref("");
const role = ref("");

const addUserToTheTeam = () => {
  teamErrorMsg.value = "";

  if (!role.value || !selectedPerson.value) {
    teamErrorMsg.value = "Data is Invalid";
    return;
  }

  team.value.push({
    userId: selectedPerson.value.id,
    role: role.value,
  });
};

const clearTeam = () => {
  team.value = [];
};

// create game function
const cgErrorMsg = ref("");
const titleErrorMsg = ref("");
const descErrorMsg = ref("");
const isError = ref(false);

const createGame = async () => {
  genresErrorMsg.value = "";
  platformsErrorMsg.value = "";
  cgErrorMsg.value = "";
  titleErrorMsg.value = "";
  descErrorMsg.value = "";
  isError.value = false;

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

  if (selectedplatforms.value.length === 0) {
    platformsErrorMsg.value = "Please, select platforms";
    isError.value = true;
  }

  if (isError.value) return;

  game.genres = selectedGenre.value.map((genre) => genre.id);
  game.platforms = selectedplatforms.value.map((platrform) => platrform.id);
  game.tags = tags.value
    .split(",")
    .map((tag) => tag.trim().replace(/[\s]+/g, "-").toLowerCase())
    .filter((tag) => tag.length !== 0);
  game.team = team.value;

  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;

  const { data, error } = await useFetch("games", {
    baseURL: apiUrl,
    method: "post",
    credentials: "include",
    body: game,
  });

  if (error.value) {
    console.log(error.value);
    cgErrorMsg.value = "Error while game creating, please, try again later";
  }
  if (data.value) {
    useRouter().push({ name: "profile", params: { id: useAuth().userId } });
  }
};

const clear = () => {
  team.value = [];
};
</script>

<template>
  <div
    class="game-page max-w-7xl bg-[#241468] text-white overflow-hidden mx-auto flex flex-col my-5 rounded-lg"
  >
    <div class="space-y-10 divide-y divide-gray-900/10">
      <div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 p-2">
        <div class="px-4 sm:px-0 flex flex-col text-start">
          <h2 class="text-base font-semibold leading-7">Main info</h2>
          <p class="mt-1 text-sm leading-6">
            This is main information about your game
          </p>
        </div>

        <div
          class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        >
          <!-- INPUTS -->
          <div class="px-4 py-6 sm:p-8">
            <div
              class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
            >
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
                  <textarea
                    v-model="game.description"
                    id="description"
                    name="description"
                    rows="3"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
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
                        {{
                          selectedGenre.map((genre) => genre.name).join(", ")
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
                          v-for="genre in genres"
                          :key="genre.id"
                          :value="genre"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900',
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
                <Listbox as="div" v-model="selectedplatforms" multiple>
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
                          selectedplatforms
                            .map((genre) => genre.name)
                            .join(", ")
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
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900',
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
                <p class="mt-1 text-sm leading-6 text-gray-600">
                  Write with a comma.
                </p>
              </div>

              <!-- TEAM -->
              <div class="col-span-full">
                <div class="md:w-1/3">
                  <!-- ADD USER TO THE TEAM -->
                  <Combobox as="div" v-model="selectedPerson">
                    <ComboboxLabel
                      class="block text-sm font-medium leading-6 text-gray-900"
                      >Team</ComboboxLabel
                    >
                    <div class="relative mt-2">
                      <ComboboxInput
                        class="w-full rounded-t-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        @change="query = $event.target.value"
                        :displayValue="(person) => (person as IUser).username"
                      />
                      <ComboboxButton
                        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
                      >
                        <ChevronUpDownIcon
                          class="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </ComboboxButton>

                      <ComboboxOptions
                        v-if="filteredPeople.length > 0"
                        class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
                        <ComboboxOption
                          v-for="person in filteredPeople"
                          :key="person.id"
                          :value="person"
                          as="template"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900',
                            ]"
                          >
                            <span
                              :class="[
                                'block truncate',
                                selected && 'font-semibold',
                              ]"
                            >
                              {{ person.username }}
                            </span>

                            <span
                              v-if="selected"
                              :class="[
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                active ? 'text-white' : 'text-indigo-600',
                              ]"
                            >
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ComboboxOption>
                      </ComboboxOptions>
                    </div>
                  </Combobox>
                  <input
                    v-model="role"
                    type="text"
                    name="role"
                    id="role"
                    class="block h-10 w-full rounded-b-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />

                  <div class="w-full flex justify-end gap-2 mt-2">
                    <button
                      @click="clear"
                      type="submit"
                      class="rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                    >
                      Clear
                    </button>
                    <button
                      @click="addUserToTheTeam"
                      class="rounded-md flex items-center justify-center gap-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add <UserPlusIcon class="w-5" />
                    </button>
                  </div>
                  <div>
                    <p class="text-red-500">{{ teamErrorMsg }}</p>
                  </div>
                </div>
                <div class="overflow-x-scroll p-2">
                  <ul class="flex gap-2">
                    <li v-for="(member, index) in team" :key="index">
                      <GamesTeamCard
                        :userId="member.userId"
                        :isManage="false"
                        :username="
                          //@ts-ignore
                          users.find((user) => user.id === member.userId)
                            .username
                        "
                        :role="member.role"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- BUTTONS -->
          <div
            class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
          >
            <button
              type="button"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              @click="createGame"
              type="submit"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
          <div class="flex justify-center items-center p-3">
            <p class="text-sm text-red-600 pt-2">
              {{ cgErrorMsg }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
