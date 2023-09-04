import axios, { AxiosError } from "axios";
import { ICredentionals } from "@/types/user/creds.interface";
import { ICreateUser } from "@/types/user/createUser.interface";

export const useAuth = defineStore("auth", () => {
  // define config to retreive api url
  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;

  // error message for auth methods
  const errorMsg = ref("");

  // user id
  const userId = ref("");

  // is authed
  const isAuthed = ref(false);

  async function logIn(creds: ICredentionals) {
    try {
      errorMsg.value = "";
      await axios.post(`${apiUrl}/auth/login`, creds, {
        withCredentials: true,
      });

      // update userid
      await checkIfLoggedIn();

      //redirect to the main page
      return navigateTo("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401)
          errorMsg.value = "Wrong email or password";
        else errorMsg.value = "Server error, try again later";
      }
    }
  }

  async function signUp(data: ICreateUser) {
    try {
      errorMsg.value = "";
      await axios.post(`${apiUrl}/auth/register`, data);
      //redirect to the main page
      return navigateTo({ name: "login" });
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 400)
          errorMsg.value = "This email already in use";
        else errorMsg.value = "Server error, try again later";
      }
    }
  }

  async function logOut() {
    await useFetch(`/auth/logout`, {
      baseURL: apiUrl,
      method: "post",
      credentials: "include",
    });
    return navigateTo({ name: "login" });
  }

  async function checkIfLoggedIn() {
    try {
      const { data } = await useFetch<string>(`/auth/check`, {
        baseURL: apiUrl,
        method: "get",
        credentials: "include",
      });

      if (!data.value) {
        userId.value = "";
        isAuthed.value = false;
        return false;
      }

      userId.value = data.value;
      isAuthed.value = true;

      return true;
    } catch (e) {
      userId.value = "";
      isAuthed.value = false;
      return false;
    }
  }

  return {
    logIn,
    errorMsg,
    checkIfLoggedIn,
    userId,
    isAuthed,
    signUp,
    logOut,
  };
});
