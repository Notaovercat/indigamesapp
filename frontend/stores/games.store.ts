import axios, { AxiosError } from "axios";
import { IGamePreview } from "@/types/games/gamePreview.interface";
import { IGame } from "@/types/games/game.interface";

export const useGames = defineStore("game", () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;
  const errorlg = ref("");
  // @ts-ignore
  const game: Ref<IGame> = ref({});

  async function getFeaturedGames(): Promise<IGamePreview[] | undefined> {
    try {
      const res = await axios.get<IGamePreview[]>(
        `${apiUrl}/games?isFeatured=true`,
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (e) {
      // console.log(e);
    }
  }

  async function getLastGames(): Promise<IGamePreview[] | undefined> {
    try {
      errorlg.value = "";
      const res = await axios.get<IGamePreview[]>(
        `${apiUrl}/games?lastUpdated=true`
      );
      return res.data;
    } catch (e) {
      if (e instanceof AxiosError) errorlg.value = "Server error";
    }
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
  };
});
