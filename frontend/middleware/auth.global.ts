export default defineNuxtRouteMiddleware(async () => {
  await useAuth().checkIfLoggedIn();
});
