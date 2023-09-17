import { IGenre } from "@workspace/shared";

export const useGenres = defineStore("genres", () => {
  // define config to retreive api url
  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;

  const genres = ref<IGenre[]>([]);
  const isLoading = ref(false);
  const errorMsg = ref("");

  async function getGenres() {
    errorMsg.value = "";
    isLoading.value = true;

    const { data, error } = await useMyFetch<IGenre[]>("genres", {
      method: "get",
    });

    // if error, set errorMsg value
    if (error.value) errorMsg.value = "Please try again later";

    // get data
    if (data.value) genres.value = data.value;

    isLoading.value = false;
  }

  return {
    getGenres,
    genres,
  };
});
