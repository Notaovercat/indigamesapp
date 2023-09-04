<script setup lang="ts">
useHead({
  title: "Sign Up",
});
definePageMeta({
  name: "signup",
  middleware: ["login-check"],
});

import { ICreateUser } from "@/types/user/createUser.interface";

const authStore = useAuth();

const user = reactive<ICreateUser>({
  email: "",
  username: "",
  password: "",
  description: "",
});

const errorMsgEmail = ref("");
const errorMsgUsername = ref("");
const errorMsgPassword = ref("");
const errorMsgAuth = ref("");

const repeatedPassword = ref("");

watch(
  () => authStore.errorMsg,
  () => (errorMsgAuth.value = authStore.errorMsg)
);

const validateEmail = (email: string) => {
  return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
};

const handleSignUp = () => {
  // CLEAR ERRORS
  errorMsgEmail.value = "";
  errorMsgUsername.value = "";
  errorMsgPassword.value = "";
  errorMsgAuth.value = "";

  // VALIDATE EMAIL INPUT
  if (!validateEmail(user.email)) {
    errorMsgEmail.value = "Email is invalid";
  }

  // VALIDATE USERNAME INPUT
  if (user.username.trim().length <= 5) {
    errorMsgUsername.value = "Username is invalid";
  }

  // VALIDATE PASSWORD INPUT
  if (user.password.trim().length <= 3) {
    errorMsgPassword.value = "Password is invalid";
    user.password = "";
  }

  // CHECK PASSWORDS
  if (user.password !== repeatedPassword.value) {
    errorMsgPassword.value = "Passwords dont't match";
    repeatedPassword.value = "";
    user.password = "";
  }

  if (user.email) if (!user.email || !user.password || !user.username) return;

  // HANDLE SIGN UP
  authStore.signUp(user);
};
</script>

<template>
  <div
    class="max-w-screen-lg bg-[#241468] text-white mx-auto rounded-lg my-5 p-0 md:p-8"
  >
    <div class="space-y-12 p-2 md:p-0">
      <div class="border-b border-gray-900/10 pb-12">
        <!-- RETURN TO LOGIN PAGE -->
        <h2 class="mb-4 text-base text-white">
          ← or
          <NuxtLink
            class="text-[#EA1179] cursor-pointer hover:underline"
            :to="{ name: 'login' }"
            >back to login
          </NuxtLink>
        </h2>

        <!-- TITLE -->
        <h2 class="text-2xl font-bold leading-7">Sign Up</h2>
        <!-- <p class="mt-1 text-sm leading-6 text-gray-600">
          This information will be displayed publicly so be careful what you
          share.
        </p> -->

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <!-- USER INPUT -->
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm font-medium leading-6"
              >Username</label
            >
            <small class="pl-1 py-1 text-gray-200">More then 5 symbols</small>
            <div class="mt-2">
              <input
                v-model="user.username"
                type="text"
                name="username"
                class="w-full px-4 py-2 text-sm border rounded-md shadow-sm sm:max-w-md text-black focus:border-[#EA1179] focus:outline-none focus:ring-1 focus:ring-[#611681]"
              />
            </div>

            <p class="text-red-600 pl-1 pt-2">{{ errorMsgUsername }}</p>
          </div>

          <!-- EMAIL INPUT -->
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm font-medium leading-6"
              >Email</label
            >
            <div class="mt-2">
              <input
                v-model="user.email"
                type="text"
                name="email"
                class="w-full px-4 py-2 text-sm border rounded-md shadow-sm sm:max-w-md text-black focus:border-[#EA1179] focus:outline-none focus:ring-1 focus:ring-[#611681]"
                placeholder="example@mail.com"
              />
            </div>
            <p class="text-red-600 pl-1 pt-2">{{ errorMsgEmail }}</p>
          </div>

          <!-- PASSWORD INPUT -->
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm font-medium leading-6"
              >Password</label
            >
            <div class="mt-2">
              <input
                v-model="user.password"
                type="password"
                name="password"
                class="w-full px-4 py-2 text-sm border rounded-md shadow-sm sm:max-w-md text-black focus:border-[#EA1179] focus:outline-none focus:ring-1 focus:ring-[#611681]"
              />
            </div>
            <p class="text-red-600 pl-1 pt-2">{{ errorMsgPassword }}</p>
          </div>

          <!-- REPEATED PASSWORD -->
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm font-medium leading-6"
              >Repeat your password</label
            >
            <div class="mt-2">
              <input
                v-model="repeatedPassword"
                type="password"
                name="passwordrepeat"
                class="w-full px-4 py-2 text-sm border rounded-md shadow-sm sm:max-w-md text-black focus:border-[#EA1179] focus:outline-none focus:ring-1 focus:ring-[#611681]"
              />
            </div>
          </div>

          <div class="col-span-full">
            <label for="about" class="block text-sm font-medium leading-6"
              >About</label
            >
            <div class="mt-2">
              <textarea
                v-model="user.description"
                id="about"
                name="about"
                rows="3"
                class="block text-black w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder: focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p class="mt-3 text-sm leading-6">
              Write a few sentences about yourself.
            </p>
          </div>

          <!-- <div class="col-span-full">
            <label for="photo" class="block text-sm font-medium leading-6"
              >Photo</label
            >
            <div class="mt-2 flex items-center gap-x-3">
              <UserCircleIcon
                class="h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
              <button
                class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <input type="file" />
              </button>
            </div>
          </div> -->
          <div class="sm:col-span-3">
            <hr class="mt-8" />
          </div>

          <div class="col-span-full flex flex-col justify-center">
            <p class="text-red-600 pl-1 pt-2">{{ errorMsgAuth }}</p>
            <button
              class="block w-24 px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-[#a91da9] border border-transparent rounded-lg active:bg-[#EA1179] hover:bg-[#EA1179] focus:outline-none focus:shadow-outline-blue"
              @click="handleSignUp"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
types/user/createUser.interface
