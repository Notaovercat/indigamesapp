import axios, { AxiosError } from "axios";
import { IGamePreview } from "@/types/games/gamePreview.interface";
import { IGame } from "@/types/games/game.interface";

export const useGames = defineStore("game", () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;
  const errorlg = ref("");

  async function getFeaturedGames(): Promise<IGamePreview[] | undefined> {
    try {
      const res = await axios.get<IGamePreview[]>(
        `${apiUrl}/games?isFeatured=true`
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

  async function getGameById(id: string) {
    try {
      const res = await axios.get<IGame>(`${apiUrl}/games/${id}`);
      return res.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.message);
      }
    }
  }

  return {
    getFeaturedGames,
    getLastGames,
    getGameById,
    errorlg,
  };
});
