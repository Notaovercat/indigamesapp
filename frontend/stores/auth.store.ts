import { ICreateUser } from "@/types/user/createUser.interface";

export const useAuth = defineStore("auth", () => {
  const errorMsg = ref("");

  // user id
  const userId = ref("");

  // is authed
  const isAuthed = ref(false);

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
      return;
    }

    if (data.value) {
      return navigateTo({ name: "login" });
    }
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
    errorMsg,
    checkIfLoggedIn,
    userId,
    isAuthed,
    signUp,
    logOut,
  };
});
