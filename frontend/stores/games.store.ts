import { IGamePreview } from "@workspace/shared";
import { IGame } from "@workspace/shared";

export const useGames = defineStore("game", () => {
  const errorlg = ref("");
  const errorMsg = ref("");
  const game = ref({}) as Ref<IGame>;
  const lastGames: Ref<IGamePreview[]> = ref([]);
  const featuredGames: Ref<IGamePreview[]> = ref([]);

  async function getFeaturedGames() {
    const { data, error } = await useMyFetch<IGamePreview[]>("games", {
      query: {
        isFeatured: true,
      },
    });

    if (error.value)
      errorMsg.value =
        "Error while trying get last games, Please, try again later";

    if (data.value) featuredGames.value = data.value;
  }

  async function getLastGames(query?: any) {
    const { data, error } = await useMyFetch<IGamePreview[]>("games", {
      query,
    });

    if (error.value)
      errorMsg.value =
        "Error while trying get last games, Please, try again later";

    if (data.value) lastGames.value = data.value;
  }

  async function getGameById(id: string) {
    const { data, error } = await useMyFetch<IGame>(`games/${id}`);

    if (error.value) {
      showError({
        statusCode: error.value.statusCode,
        statusMessage: error.value.data.message,
      });
    }

    if (data.value) game.value = data.value;
  }

  return {
    getFeaturedGames,
    getLastGames,
    getGameById,
    errorlg,
    game,
    lastGames,
    errorMsg,
    featuredGames,
  };
});
