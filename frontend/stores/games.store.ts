import axios, { AxiosError } from "axios";
import { IGamePreview } from "@/types/games/gamePreview.interface";
import { IGame } from "@/types/games/game.interface";

export const useGames = defineStore("game", () => {
  const errorlg = ref("");
  const errorMsg = ref("");
  // @ts-ignore
  const game: Ref<IGame> = ref({});
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

  async function getLastGames() {
    const { data, error } = await useMyFetch<IGamePreview[]>("games", {
      query: {
        lastUpdated: true,
      },
    });

    if (error.value)
      errorMsg.value =
        "Error while trying get last games, Please, try again later";

    if (data.value) lastGames.value = data.value;
  }

  async function getGameById(id: string, isManage = false) {
    const { data, error } = await useMyFetch<IGame>(
      `games/${id}?isManage=${isManage}`,
      {
        method: "get",
        cache: "no-cache",
      }
    );

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
