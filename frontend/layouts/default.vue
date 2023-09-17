<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { IProfile } from "@workspace/shared";
import { UserIcon } from "@heroicons/vue/20/solid";

const useAuthStore = useAuth();
const useProfileStore = useProfile();
const isAuthed = ref(useAuthStore.isAuthed);
const router = useRouter();
const profile = ref<IProfile>();

watch(
  () => useAuthStore.isAuthed,
  () => {
    isAuthed.value = useAuthStore.isAuthed;
  }
);

const getProfile = async () => {
  await useProfileStore.getProfile(useAuthStore.userId);
};

watch(
  () => useProfileStore.profileInfo,
  () => (profile.value = useProfileStore.profileInfo),
  { immediate: true }
);
</script>
<template>
  <Disclosure
    as="nav"
    class="bg-gradient-to-r from-purple-700 via-blue-900 to-rose-800 select-none"
    v-slot="{ open }"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-auto p-2 md:h-[6rem] items-center justify-between">
        <div class="flex items-center">
          <NuxtLink
            :to="{ name: 'main' }"
            class="flex-shrink-0 relative cursor-pointer group"
          >
            <img
              class="block h-10 w-auto sm:hidden relative z-10 group-hover:scale-150 duration-75 transition-all"
              src="../assets/images/logo.png"
              alt="logo1"
            />
            <img
              class="hidden h-20 w-auto sm:block relative z-10 group-hover:scale-110 duration-75 transition-all"
              src="../assets/images/logo.png"
              alt="logo2"
            />
            <div
              class="bg-cyan-300 top-0 absolute h-16 rounded-full w-full blur-md block opacity-0 group-hover:opacity-100 transition-all duration-75"
            />
          </NuxtLink>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <NavButton name="Browse all games" path="all" />
              <NavButton name="Upload your game" path="upload" />
            </div>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <!-- PROFILE/LOGIN BUTTONS -->
          <div v-if="isAuthed" class="flex items-center">
            <!-- NOTIFICATIONS -->
            <!-- <button
              type="button"
              class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button> -->

            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <div>
                <NavProfileButton />
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <NavOpenProfileButton :active="active" />
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <NavLogoutButton :active="active" />
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <div v-else>
            <button
              type="button"
              class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none hover:bg-[#EA1179] focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
              @click="router.push({ name: 'login' })"
            >
              <ArrowLeftOnRectangleIcon class="h-14 w-14" aria-hidden="true" />
            </button>
          </div>
        </div>

        <!-- MOBILE MENU -->
        <div class="-mr-2 flex sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            @click="
              () => {
                if (isAuthed && !open && !profile) getProfile();
              }
            "
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-cyan-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <!-- MOBILE PROFILE INFO -->
    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->

        <NavMobileButton name="All games" path="all" />
        <NavMobileButton name="Upload your game" path="upload" />
      </div>

      <div
        v-if="isAuthed && profile"
        class="border-t border-gray-700 pb-3 pt-4"
      >
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <UserIcon
              class="h-8 w-8 bg-gray-800 text-white rounded-full"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-white">
              {{ profile.username }}
            </div>
            <div class="text-sm font-medium text-gray-400">
              {{ profile.email }}
            </div>
          </div>

          <!-- NOTIFICATIONS -->
          <!-- <button
            type="button"
            class="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button> -->
        </div>
        <div class="mt-3 space-y-1 px-2">
          <!-- <div
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
          >
        </div> -->
          <NavOpenProfileButton
            class="block rounded-md hover:bg-[#EA1179] px-3 py-2 text-base font-medium text-white"
            :active="false"
          />

          <NavLogoutButton
            class="block rounded-md hover:bg-[#EA1179] px-3 py-2 text-base font-medium text-white"
            :active="false"
          />
        </div>
      </div>

      <!-- MOBILE LOGIN BUTTON -->
      <div v-else>
        <div class="flex justify-center items-center">
          <button
            type="button"
            class="flex justify-center bg-gray-800 items-center rounded-full p-1 text-white focus:outline-none hover:bg-[#EA1179] focus:ring-2 transition-all"
            @click="router.push({ name: 'login' })"
          >
            <ArrowLeftOnRectangleIcon
              class="h-8 w-8 rounded-full"
              aria-hidden="true"
            />
            <span>Login</span>
          </button>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
  <slot></slot>

  <NavFooter />
</template>
