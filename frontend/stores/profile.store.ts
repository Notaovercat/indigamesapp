import { IGameCard } from "@/types/profile/gameCard.interface";
import { IUserTeams } from "@/types/profile/userTeams.interface";
import { IProfile } from "@/types/profile/profile.interface";

export const useProfile = defineStore("profile", () => {
  // define config to retreive api url
  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;

  // define state data
  const profileGames = ref<IGameCard[]>([]);
  const profileTeams = ref<IUserTeams[]>([]);
  const profileInfo = ref<IProfile>();
  //   {
  //   id: "",
  //   username: "",
  //   email: "",
  //   description: "",
  // }

  // error messages
  const gameErrorMsg = ref("");
  const teamErrorMsg = ref("");
  const profileErrorMsg = ref("");

  // loading states
  const gameLoading = ref(false);
  const teamLoading = ref(false);
  const profileLoading = ref(false);

  // get profile by id
  async function getProfile(id: string) {
    // return useFetch<IProfile>(`profile/${id}`, {
    //   baseURL: apiUrl,
    //   method: "get",
    //   credentials: "include",
    // });

    // set loading to true
    profileLoading.value = true;

    const { data, error } = await useFetch<IProfile>(`profile/${id}`, {
      baseURL: apiUrl,
      method: "get",
      credentials: "include",
    });

    // if error, set errorMsg value
    if (error.value) profileErrorMsg.value = "Please try again later";

    //
    if (data.value) profileInfo.value = data.value;
    profileLoading.value = false;
  }

  async function getProfileGames(id: string, isYourProfile: boolean) {
    // return useFetch<IGameCard[]>(
    //   `profile/${id}/games?isYourProfile=${isYourProfile}`,
    //   {
    //     baseURL: apiUrl,
    //     method: "get",
    //     credentials: "include",
    //   }
    // );

    // set loading to true
    gameLoading.value = true;

    // make a reaquest
    const { data, error } = await useFetch<IGameCard[]>(
      `profile/${id}/games?isYourProfile=${isYourProfile}`,
      {
        baseURL: apiUrl,
        method: "get",
        credentials: "include",
      }
    );

    // if error, set errorMsg value
    if (error.value) gameErrorMsg.value = "Please try again later";

    // get data
    if (data.value) profileGames.value = data.value;
    gameLoading.value = false;
  }

  async function getProfileTeams(id: string, isYourProfile: boolean) {
    // return useFetch<IUserTeams[]>(
    //   `profile/${id}/teams?isYourProfile=${isYourProfile}`,
    //   {
    //     baseURL: apiUrl,
    //     method: "get",
    //     credentials: "include",
    //   }
    // );

    const { data, error } = await useFetch<IUserTeams[]>(
      `profile/${id}/teams?isYourProfile=${isYourProfile}`,
      {
        baseURL: apiUrl,
        method: "get",
        credentials: "include",
      }
    );

    if (error.value) teamErrorMsg.value = "Please try again later";
    if (data.value) profileTeams.value = data.value;
  }

  return {
    getProfile,
    getProfileGames,
    getProfileTeams,
    profileGames,
    profileTeams,
    gameErrorMsg,
    teamErrorMsg,
    gameLoading,
    teamLoading,
    profileInfo,
    profileErrorMsg,
    profileLoading,
  };
});