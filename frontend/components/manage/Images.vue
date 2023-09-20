<script setup lang="ts">
import { PhotoIcon } from "@heroicons/vue/20/solid";

interface IImage {
  id: string;
  name: string;
}
interface Props {
  gameId: string;
  coverImage: IImage | null;
  screenshots: IImage[];
}

const { screenshots, coverImage, gameId } = defineProps<Props>();

// COVER
const cover = ref(coverImage);
const coverInput: Ref<File | undefined> = ref();
let coverUrl = "";
const coverSuccMsg = ref("");
const coverErrorMsg = ref("");

const onCoverChanged = ($event: Event) => {
  coverUrl = "";
  const target = $event.target as HTMLInputElement;
  if (target && target.files) {
    coverInput.value = target.files[0];
    coverUrl = URL.createObjectURL(coverInput.value);
  }
};

const handleCoverUpload = async () => {
  if (!coverInput.value) return;
  let formData = new FormData();

  formData.append("cover", coverInput.value);
  const { data, error } = await useMyFetch<IImage>(`games/${gameId}/cover`, {
    method: "PATCH",
    body: formData,
  });

  if (error.value)
    coverErrorMsg.value =
      "Error while trying upload cover, please, tru againg later";

  if (data.value) {
    coverInput.value = undefined;
    cover.value = data.value;
    coverSuccMsg.value = "Cover image has been updated";
  }
};

const handleCoverDiscard = () => {
  coverInput.value = undefined;
};

// SCREENSHOTS
const screens = ref(screenshots);
const screenErrorMsg = ref("");
const screenSuccMsg = ref("");
const isLoading = ref(false);
const screenInput: Ref<File | undefined> = ref();
let screenUrl = "";

const handleScreenUpload = async () => {
  isLoading.value = true;
  if (!screenInput.value) return;
  let formData = new FormData();

  formData.append("screenshot", screenInput.value);
  const { data, error } = await useMyFetch<IImage>(
    `games/${gameId}/screenshot`,
    {
      method: "PATCH",
      body: formData,
    }
  );

  if (error.value)
    screenErrorMsg.value =
      "Error while trying upload screenshot, please, try againg later";

  if (data.value) {
    screenInput.value = undefined;
    screens.value.push({
      id: data.value.id,
      name: data.value.name,
    });
  }
  isLoading.value = false;
};

const handleScreenDiscard = () => (screenInput.value = undefined);

const onScreenChanged = ($event: Event) => {
  screenUrl = "";
  const target = $event.target as HTMLInputElement;
  if (target && target.files) {
    screenInput.value = target.files[0];
    screenUrl = URL.createObjectURL(screenInput.value);
  }
};

const handleDelete = async (id: string) => {
  isLoading.value = true;
  screenErrorMsg.value = "";

  const { data, error } = await useMyFetch<IImage>(
    `games/${gameId}/screenshot/${id}`,
    {
      method: "DELETE",
    }
  );

  if (error.value)
    screenErrorMsg.value =
      "Error while deleting screenshots, please, try again later";

  if (data.value) {
    const ind = screens.value.findIndex((val) => val.id === data.value?.id);
    if (ind !== -1) screens.value.splice(ind, 1);
  }

  isLoading.value = false;
};
</script>

<template>
  <!-- INPUTS -->
  <div class="space-y-12 px-4 md:px-8">
    <div class="border-b border-gray-900/10 pb-12">
      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <!-- COVER IMAGE -->
        <div class="col-span-full">
          <label
            for="cover-photo"
            class="block text-lg font-medium leading-6 text-gray-900"
            >Cover image</label
          >
          <div
            class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
          >
            <div class="text-center">
              <PhotoIcon class="mx-auto h-12 w-12 text-gray-300" />

              <div class="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  for="cover-upload"
                  class="relative cursor-pointer rounded-md bg-slate-200 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a cover</span>
                  <input
                    id="cover-upload"
                    name="cover-upload"
                    type="file"
                    class="sr-only"
                    @change="onCoverChanged"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs leading-5 text-gray-600">
                PNG, JPG up to 10MB 1280x320px
              </p>
            </div>
          </div>

          <!-- COVER PREVIEW -->
          <div class="flex py-2 flex-col">
            <GamesCoverImage v-if="!coverInput" :coverImageName="cover?.name" />

            <div v-else class="flex relative w-full overflow-hidden rounded">
              <img
                :src="coverUrl"
                class="w-full h-80 relative object-contain z-10"
                alt="cover-input"
              />

              <img
                :src="coverUrl"
                class="absolute w-full h-80 object-cover blur-xl"
                alt="cover-image-bg"
              />
            </div>

            <!-- SAVE/DISCARD BUTTONS -->
            <div class="flex justify-center items-center p-2 flex-col">
              <div class="flex gap-6">
                <button
                  v-if="coverInput"
                  @click="handleCoverUpload"
                  class="block px-6 py-4 bg-blue-600 w-auto rounded shadow text-white hover:bg-blue-950 transition-all"
                >
                  Save
                </button>

                <button
                  v-if="coverInput"
                  @click="handleCoverDiscard"
                  class="block px-6 py-4 bg-red-800 w-auto rounded shadow text-white hover:bg-blue-950 transition-all"
                >
                  Discard
                </button>
              </div>

              <p v-if="coverErrorMsg" class="text-red-600">
                {{ coverErrorMsg }}
              </p>
              <p v-if="coverSuccMsg" class="text-green-600">
                {{ coverSuccMsg }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-span-full">
          <hr class="h-px my-8 bg-gray-200 border-0" />
        </div>

        <!-- SCREENSHOTS -->
        <div class="col-span-full">
          <label
            for="cover-photo"
            class="block text-lg font-medium leading-6 text-gray-900"
            >Screenshots</label
          >
          <div
            class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
          >
            <div class="text-center">
              <PhotoIcon class="mx-auto h-12 w-12 text-gray-300" />
              <div class="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  for="screen-upload"
                  class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a screenshot</span>
                  <input
                    @change="onScreenChanged"
                    id="screen-upload"
                    name="screen-upload"
                    type="file"
                    class="sr-only"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs leading-5 text-gray-600">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div
            class="flex flex-col justify-center items-center p-9 gap-2"
            v-if="screenInput"
          >
            <img :src="screenUrl" alt="upload-screen" class="w-80" />

            <div class="flex gap-6">
              <button
                v-if="screenInput"
                @click="handleScreenUpload"
                class="block px-6 py-4 bg-blue-600 w-auto rounded shadow text-white hover:bg-blue-950 transition-all"
                :disabled="isLoading"
              >
                Save
              </button>

              <button
                v-if="screenInput"
                @click="handleScreenDiscard"
                class="block px-6 py-4 bg-red-800 w-auto rounded shadow text-white hover:bg-blue-950 transition-all"
                :disabled="isLoading"
              >
                Discard
              </button>
            </div>
          </div>

          <div class="flex relative overflow-x-scroll gap-6 py-6">
            <div
              v-if="isLoading"
              class="absolute z-20 bg-white opacity-50 w-full h-full"
            ></div>
            <GamesScreenshot
              v-for="screen of screens"
              @delete="handleDelete"
              :key="screen.id"
              :screenName="screen.name"
              :screen-id="screen.id"
              :isManage="true"
            />
            <p class="text-red-600">
              {{ screenErrorMsg }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
