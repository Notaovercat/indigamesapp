<script setup lang="ts">
useHead({
  title: "Login",
});
definePageMeta({
  name: "login",
  layout: "plain",
  middleware: ["login-check"],
});

import { ICredentionals } from "@/types/user/creds.interface";

const authStore = useAuth();

const user = reactive<ICredentionals>({
  email: "",
  password: "",
});

const errorMsgEmail = ref("");
const errorMsgPassword = ref("");
const errorMsgAuth = ref("");

const validateEmail = (email: string) => {
  return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
};

const handleLogin = async () => {
  // CLEAR ERRORS
  errorMsgEmail.value = "";
  errorMsgPassword.value = "";
  errorMsgAuth.value = "";

  // VALIDATE FORM
  if (!validateEmail(user.email)) {
    errorMsgEmail.value = "Email is invalid";
  }

  if (user.password.trim().length <= 3) {
    errorMsgPassword.value = "Password is invalid";
    user.password = "";
  }

  if (!user.email || !user.password) return;

  // HANDLE LOGIN
  // authStore.logIn(user);
  const { data, error } = await useMyFetch("auth/login", {
    method: "POST",
    body: user,
  });

  if (error.value) {
    user.password = "";
    if (error.value.statusCode === 401)
      errorMsgAuth.value = "Wrong email or password";
    else errorMsgAuth.value = "Server error, try again later";
    return;
  }

  if (data.value) {
    return navigateTo("/");
  }
};
</script>

<template>
  <div class="flex items-center min-h-screen bg-black">
    <div
      class="flex-1 h-full max-w-4xl mx-auto bg-[#241468] rounded-lg shadow-xl"
    >
      <div class="flex flex-col md:flex-row">
        <!-- IMAGE -->
        <div class="h-32 md:h-auto md:w-1/2">
          <img
            class="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="img"
          />
        </div>
        <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
          <div class="w-full">
            <div class="flex justify-center">
              <!-- ICON -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-20 h-20 text-[#EA1179]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              ></svg>
            </div>

            <!-- HEADER -->
            <h1 class="mb-1 text-2xl font-bold text-center text-white">
              Login to Your Account
            </h1>
            <h2 class="mb-4 text-base text-end text-white">
              Or
              <NuxtLink
                class="text-[#EA1179] cursor-pointer hover:underline"
                :to="{ name: 'signup' }"
                >create new account
              </NuxtLink>
            </h2>

            <!-- EMAIL INPUT -->
            <div class="flex flex-col gap-1">
              <label class="block text-sm text-white"> Email </label>
              <input
                v-model="user.email"
                type="email"
                class="w-full px-4 py-2 text-sm border rounded-md focus:border-[#EA1179] focus:outline-none focus:ring-1 focus:ring-[#611681]"
                :class="
                  errorMsgEmail
                    ? ['placeholder:text-red-600']
                    : ['placeholder:text-slate-600']
                "
                :placeholder="
                  errorMsgEmail ? errorMsgEmail : 'example@email.com'
                "
              />
            </div>

            <!-- PASSWORD INPUT -->
            <div>
              <label class="block mt-4 text-sm text-white"> Password </label>
              <input
                v-model="user.password"
                class="w-full px-4 py-2 text-sm border rounded-md focus:border-[#EA1179] focus:outline-none focus:ring-1 focus:ring-[#611681]"
                type="password"
                :class="
                  errorMsgPassword
                    ? ['placeholder:text-red-600']
                    : ['placeholder:text-slate-600']
                "
                :placeholder="
                  errorMsgPassword
                    ? errorMsgPassword
                    : 'Type your password here...'
                "
              />
            </div>

            <div class="flex justify-center items-center h-3 mt-3 py-2">
              <span class="text-red-600" v-if="errorMsgAuth">
                {{ errorMsgAuth }}
              </span>
            </div>
            <p class="mt-4">
              <a class="text-sm cursor-pointer text-pink-400 hover:underline">
                Forgot your password?
              </a>
            </p>

            <!-- LOGIN BUTTON -->
            <button
              class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-[#a91da9] border border-transparent rounded-lg active:bg-[#EA1179] hover:bg-[#EA1179] focus:outline-none focus:shadow-outline-blue"
              @click="handleLogin"
            >
              Log in
            </button>

            <hr class="my-8" />

            <!-- ADDITIONAL OPTIONS -->
            <div class="flex items-center justify-center gap-4">
              <!-- <button
                class="flex items-center justify-center w-full px-4 py-2 text-sm text-white border border-gray-300 rounded-lg hover:border-gray-500 focus:border-gray-500"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
                Github
              </button>
              <button
                class="flex items-center justify-center w-full px-4 py-2 text-sm text-white border border-gray-300 rounded-lg hover:border-gray-500 focus:border-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  class="w-4 h-4 mr-2"
                  viewBox="0 0 48 48"
                >
                  <defs>
                    <path
                      id="a"
                      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                    />
                  </defs>
                  <clipPath id="b">
                    <use xlink:href="#a" overflow="visible" />
                  </clipPath>
                  <path
                    clip-path="url(#b)"
                    fill="#FBBC05"
                    d="M0 37V11l17 13z"
                  />
                  <path
                    clip-path="url(#b)"
                    fill="#EA4335"
                    d="M0 11l17 13 7-6.1L48 14V0H0z"
                  />
                  <path
                    clip-path="url(#b)"
                    fill="#34A853"
                    d="M0 37l30-23 7.9 1L48 0v48H0z"
                  />
                  <path
                    clip-path="url(#b)"
                    fill="#4285F4"
                    d="M48 48L17 24l-4-3 35-10z"
                  />
                </svg>
                Google
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
types/creds.interface
