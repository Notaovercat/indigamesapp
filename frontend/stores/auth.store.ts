import { ICredentionals } from "@/types/user/creds.interface";
import { ICreateUser } from "@/types/user/createUser.interface";

export const useAuth = defineStore("auth", () => {
  // error message for auth methods
  const errorMsg = ref("");

  // user id
  const userId = ref("");

  // is authed
  const isAuthed = ref(false);

  async function logIn(creds: ICredentionals) {
    errorMsg.value = "";
    const { data, error } = await useMyFetch("auth/login", {
      method: "POST",
      body: creds,
    });

    if (error.value) {
      if (error.value.statusCode === 401)
        errorMsg.value = "Wrong email or password";
      else errorMsg.value = "Server error, try again later";
    }

    if (data.value) {
      await checkIfLoggedIn();
      return navigateTo("/");
    }
    // try {
    //   errorMsg.value = "";
    //   await axios.post(`${apiUrl}/auth/login`, creds, {
    //     withCredentials: true,
    //   });

    //   // update userid
    //   await checkIfLoggedIn();

    //   //redirect to the main page
    //   return navigateTo("/");
    // } catch (e) {
    //   if (e instanceof AxiosError) {
    //     if (e.response?.status === 401)
    //       errorMsg.value = "Wrong email or password";
    //     else errorMsg.value = "Server error, try again later";
    //   }
    // }
  }

  async function signUp(input: ICreateUser) {
    errorMsg.value = "";
    const { data, error } = await useMyFetch("auth/register", {
      method: "POST",
      body: input,
    });

    if (error.value) {
      if (error.value.statusCode === 400)
        errorMsg.value = "This email already in use";
      else errorMsg.value = "Server error, try again later";
    }

    if (data.value) {
      return navigateTo({ name: "login" });
    }
    // try {
    //   errorMsg.value = "";
    //   await axios.post(`${apiUrl}/auth/register`, data);
    //   //redirect to the main page
    //   return navigateTo({ name: "login" });
    // } catch (e) {
    //   if (e instanceof AxiosError) {
    //     if (e.response?.status === 400)
    //       errorMsg.value = "This email already in use";
    //     else errorMsg.value = "Server error, try again later";
    //   }
    // }
  }

  async function logOut() {
    await useMyFetch(`/auth/logout`, {
      method: "post",
    });
    return navigateTo({ name: "login" });
  }

  async function checkIfLoggedIn() {
    try {
      const { data } = await useMyFetch<string>(`/auth/check`, {
        method: "get",
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
