import { IPlatform } from "@workspace/shared";

export const usePlatforms = defineStore("platforms", () => {
  // define config to retreive api url
  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;

  const platforms = ref<IPlatform[]>([]);
  const isLoading = ref(false);
  const errorMsg = ref("");

  async function getPlatforms() {
    errorMsg.value = "";
    isLoading.value = true;

    const { data, error } = await useMyFetch<IPlatform[]>("platforms", {
      method: "get",
    });

    // if error, set errorMsg value
    if (error.value) errorMsg.value = "Please try again later";

    // get data
    if (data.value) platforms.value = data.value;

    isLoading.value = false;
  }

  return {
    getPlatforms,
    platforms,
  };
});
