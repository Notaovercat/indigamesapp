import axios from "axios";
import { IGamePreview } from "@/types/gamePreview";
import { IGame } from "../types/game";

export const useGames = defineStore("game", () => {
  async function getFeaturedGames(): Promise<IGamePreview[] | undefined> {
    try {
      const res = await axios.get<IGamePreview[]>(
        "http://localhost:3000/games?isFeatured=true"
      );
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  async function getLastGames(): Promise<IGamePreview[] | undefined> {
    try {
      const res = await axios.get<IGamePreview[]>(
        "http://localhost:3000/games?lastUpdated=true"
      );
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  async function getGameById(id: string) {
    try {
      const res = await axios.get<IGame>(`http://localhost:3000/games/${id}`);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }

  return {
    getFeaturedGames,
    getLastGames,
    getGameById,
  };
});
