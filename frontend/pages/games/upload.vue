<script setup lang="ts">
definePageMeta({
  name: "upload",
  middleware: ["auth-check"],
});
import { PhotoIcon, UserCircleIcon } from "@heroicons/vue/24/solid";
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

        <form
          class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        >
          <div class="px-4 py-6 sm:p-8">
            <div
              class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
            >
              <!-- TITLE -->
              <div class="sm:col-span-4">
                <label
                  for="website"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Title</label
                >
                <div class="mt-2">
                  <div
                    class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                  >
                    <input
                      type="text"
                      name="website"
                      id="website"
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Title of your game"
                    />
                  </div>
                </div>
              </div>

              <div class="col-span-full">
                <label
                  for="about"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Description</label
                >
                <div class="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows="3"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p class="mt-3 text-sm leading-6 text-gray-600">
                  Write what is your game about.
                </p>
              </div>

              <div class="col-span-full">
                <label
                  for="photo"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Genre</label
                >
              </div>

              <div class="col-span-full">
                <label
                  for="cover-photo"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Cover photo</label
                >
                <div
                  class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                >
                  <div class="text-center">
                    <PhotoIcon
                      class="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div class="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        for="file-upload"
                        class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          class="sr-only"
                        />
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              type="submit"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
