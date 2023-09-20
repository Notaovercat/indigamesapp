<script setup lang="ts">
import {
  Switch,
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  ListboxOptions,
  Listbox,
  ListboxOption,
  ListboxLabel,
  ListboxButton,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  Combobox,
  ComboboxOption,
  ComboboxLabel,
} from "@headlessui/vue";
import {
  EyeIcon,
  EyeSlashIcon,
  ChevronUpDownIcon,
  UserPlusIcon,
  CheckIcon,
} from "@heroicons/vue/20/solid";
import { IUser } from "@/types/user/user.interface";
import { IGame, ITeamMember, STATUS } from "@workspace/shared";

interface Props {
  game: IGame;
}

interface IStatus {
  name: string;
  status: STATUS;
  available: boolean;
  color: string;
}

const useUserStore = useUser();
let promies = [];
if (useUserStore.users.length <= 0) promies.push(useUserStore.getUsers());

await Promise.all(promies);
const isLoading = ref(false);

const { game } = defineProps<Props>();

// status
const openStatus = ref(false);
const statusErrorMsg = ref("");

const statuses = ref<IStatus[]>([
  {
    name: "Under Development",
    status: "InDevelopment",
    available: true,
    color: "blue",
  },
  {
    name: "Early Access",
    status: "EarlyAccess",
    available: true,
    color: "orange",
  },
  {
    name: "Released",
    status: "Released",
    available: true,
    color: "green",
  },
  {
    name: "Not Provided",
    status: "NonProvided",
    available: false,
    color: "gray",
  },
]);

const selectedStatus = ref(
  statuses.value.find((status) => status.status === game.status) ||
    statuses.value[3]
);

const handleChangeStatus = async () => {
  isLoading.value = true;
  statusErrorMsg.value = "";

  const { data, error } = await useMyFetch(`games/${game.id}`, {
    method: "PATCH",
    body: {
      status: selectedStatus.value.status,
    },
  });

  if (error.value) {
    statusErrorMsg.value =
      "Error while trying to change status, try again later";
  }

  if (data.value) {
    game.status = selectedStatus.value.status;
  }
  openStatus.value = false;
  isLoading.value = false;
};

//visibility
const openVisible = ref(false);
const visibility = ref(game.isVisible);
const visibilityErrorMsg = ref("");

const handleVisibility = async () => {
  isLoading.value = true;
  visibilityErrorMsg.value = "";

  const { data, error } = await useMyFetch("games/visible", {
    method: "POST",
    body: {
      gameId: game.id,
      isVisible: !visibility.value,
    },
  });

  if (error.value) {
    visibilityErrorMsg.value =
      "Error while trying to change visible, try again later";
  }

  if (data.value) {
    visibility.value = !visibility.value;
    game.isVisible = visibility.value;
  }
  openVisible.value = false;
  isLoading.value = false;
};

// status
const users = computed(() => useUserStore.users);

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

const team = ref<ITeamMember[]>(game.team ? game.team.team_members : []);
const teamErrorMsg = ref("");
const role = ref("");

const addUserToTheTeam = async () => {
  isLoading.value = true;
  teamErrorMsg.value = "";

  if (!role.value || !selectedPerson.value) {
    teamErrorMsg.value = "Invalid data";
    isLoading.value = false;
    return;
  }

  const { data, error } = await useMyFetch<ITeamMember>(
    `/teams/game/${game.id}`,
    {
      method: "POST",
      body: {
        userId: selectedPerson.value.id,
        role: role.value,
      },
    }
  );

  if (error.value) teamErrorMsg.value = "Please, try again later";

  if (data.value)
    team.value.push({
      id: data.value.id,
      role: data.value.role,
      user: selectedPerson.value,
    });

  role.value = "";
  isLoading.value = false;
};

const handleDelete = async (userId: string) => {
  teamErrorMsg.value = "";

  const teamMemberId = game.team?.team_members.find(
    (member) => member.user.id === userId
  )?.id;

  if (!teamMemberId) {
    console.log(userId);
    teamErrorMsg.value = "Please, try again later";
    return;
  }

  isLoading.value = true;
  const { data, error } = await useMyFetch<ITeamMember>(
    `/teams/game/${game.id}`,
    {
      method: "DELETE",
      body: {
        teamMemberId,
      },
    }
  );

  if (error.value) {
    // console.log(error.value.message);
    teamErrorMsg.value = "Please, try again later";
  }

  if (data.value && game.team) {
    const index = game.team.team_members.findIndex(
      (val) => val.id === data.value?.id
    );
    if (index !== -1) game.team.team_members.splice(index, 1);
    // game.team.team_members = game.team?.team_members.filter(
    //   (member) => member.id !== data.value?.id
    // );
    // team.value = game.team?.team_members;
  }
  isLoading.value = false;
};
</script>

<template>
  <!-- INPUTS -->
  <div class="px-4 py-6 sm:p-8">
    <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <!-- VISIBILITY -->
      <div class="sm:col-span-4">
        <label class="block text-xl font-medium leading-6 text-gray-900 pb-3">
          Visibility
        </label>
        <div class="flex gap-6">
          <Switch
            @click="openVisible = true"
            :class="[
              visibility ? 'bg-indigo-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
            ]"
          >
            <span
              :class="[
                visibility ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              ]"
            >
              <span
                :class="[
                  visibility
                    ? 'opacity-0 duration-100 ease-out'
                    : 'opacity-100 duration-200 ease-in',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                ]"
                aria-hidden="true"
              >
                <EyeSlashIcon class="h-3 w-3 text-gray-400" />
              </span>
              <span
                :class="[
                  visibility
                    ? 'opacity-100 duration-200 ease-in'
                    : 'opacity-0 duration-100 ease-out',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                ]"
                aria-hidden="true"
              >
                <EyeIcon class="h-3 w-3 text-indigo-600" />
              </span>
            </span>
          </Switch>

          <div class="flex justify-center items-center">
            <p class="text-black" v-if="visibility">Your game is visible</p>
            <p class="text-slate-500" v-else="enabled">Your game is hidden</p>
          </div>
        </div>

        <div v-if="visibilityErrorMsg" class="flex text-center py-5">
          <p class="text-red-600">{{ visibilityErrorMsg }}</p>
        </div>
      </div>

      <!-- STATUS -->
      <div class="sm:col-span-4">
        <Listbox as="div" v-model="selectedStatus">
          <ListboxLabel
            class="block text-xl font-medium leading-6 text-gray-900 pb-3"
          >
            Status
          </ListboxLabel>
          <div class="relative mt-2">
            <ListboxButton
              class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 h-10"
            >
              <span class="block truncate"> {{ selectedStatus.name }}</span>
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
                  v-for="status in statuses.filter(
                    (status) => status.available !== false
                  )"
                  :value="status"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'bg-slate-100 ' : 'text-gray-900',
                      'relative  select-none py-2 pl-3 pr-9 cursor-pointer',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate',
                      ]"
                    >
                      <span :class="[`text-${status.color}-600`]">●</span>
                      {{ status.name }}</span
                    >

                    <span
                      v-if="selected"
                      :class="[
                        active ? 'text-black' : 'text-indigo-600',
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

        <div class="py-3">
          <button
            class="rounded-md flex items-center justify-center gap-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-500"
            @click="openStatus = true"
            :disabled="selectedStatus.status === game.status"
          >
            Save
          </button>
        </div>

        <div v-if="statusErrorMsg" class="flex text-center py-5">
          <p class="text-red-600">{{ statusErrorMsg }}</p>
        </div>
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
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                    ]"
                  >
                    <span
                      :class="['block truncate', selected && 'font-semibold']"
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
              @click="addUserToTheTeam"
              :disabled="isLoading"
              class="rounded-md flex items-center justify-center gap-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-500"
            >
              Add <UserPlusIcon class="w-5" />
            </button>
          </div>
          <div>
            <p class="text-red-500">{{ teamErrorMsg }}</p>
          </div>
        </div>
        <div class="overflow-x-scroll overflow-y-hidden py-8 relative">
          <div
            v-if="isLoading"
            class="absolute z-20 bg-white opacity-50 w-full h-full"
          ></div>
          <div
            v-if="team.length <= 0"
            class="flex justify-center items-center p-9"
          >
            <p>You have no team</p>
          </div>
          <ul v-else class="flex gap-2">
            <li v-for="member in team" :key="member.id" class="">
              <GamesTeamCard
                :onDelete="handleDelete"
                :userId="member.user.id"
                :isManage="true"
                :username="member.user.username"
                :role="member.role"
              />
            </li>
          </ul>
        </div>
      </div>

      <div class="col-span-full"></div>
    </div>
  </div>

  <!-- VISIBLE WINDOW -->
  <TransitionRoot as="template" :show="openVisible">
    <Dialog
      as="div"
      class="relative z-10"
      :open="openVisible"
      @close="openVisible = false"
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
                  <EyeIcon
                    v-if="!visibility"
                    class="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                  <EyeSlashIcon
                    v-else
                    class="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Change visibility</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      <span v-if="!visibility"
                        >Make your game visible for all?</span
                      >
                      <span v-else>Hide your game?</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  :disabled="isLoading"
                  @click="handleVisibility"
                  class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:bg-blue-500"
                >
                  <span v-if="!visibility">Make game visible</span>
                  <span v-else>Hide game</span>
                </button>
                <button
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="openVisible = false"
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

  <!-- STATUS BUTTON -->
  <TransitionRoot as="template" :show="openStatus">
    <Dialog
      as="div"
      class="relative z-10"
      :open="openStatus"
      @close="openStatus = false"
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
                <!-- <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  
                </div> -->
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Change status</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Change your status to {{ selectedStatus.name }}?
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  :disabled="isLoading"
                  @click="handleChangeStatus"
                  class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:bg-blue-500 hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  <p>Change status</p>
                </button>
                <button
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="openStatus = false"
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
