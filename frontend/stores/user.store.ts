import { IUser } from "@/types/user/user.interface";

export const useUser = defineStore("users", () => {
  const users = ref<IUser[]>([]);
  const isLoading = ref(false);
  const errorMsg = ref("");

  async function getUsers() {
    errorMsg.value = "";
    isLoading.value = true;

    const { data, error } = await useMyFetch<IUser[]>("users", {
      method: "get",
    });

    // if error, set errorMsg value
    if (error.value) errorMsg.value = "Please try again later";

    // get data
    if (data.value) users.value = data.value;

    isLoading.value = false;
  }

  return {
    getUsers,
    users,
  };
});
