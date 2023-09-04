export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuth();

  const isLoggedIn = await authStore.checkIfLoggedIn();

  if (isLoggedIn) return navigateTo("/");
});
