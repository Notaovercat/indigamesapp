<script setup lang="ts">
definePageMeta({
  // middleware: ["auth-check"],
  name: "profile",
});

const route = useRoute();
const useAuthStore = useAuth();
const profileId = route.params["id"] as string;
let isYourProfile = false;

const useProfileStore = useProfile();

onBeforeMount(async () => {
  isYourProfile = profileId === useAuthStore.userId;

  // make requests to the server via pinia
  await Promise.all([
    useProfileStore.getProfileGames(profileId, isYourProfile),
    useProfileStore.getProfileTeams(profileId, isYourProfile),
    useProfileStore.getProfile(profileId),
  ]);
});
</script>

<template>
  <div
    class="profile-page max-w-7xl text-white overflow-hidden mx-auto flex flex-col my-5 rounded-lg p-2 gap-2"
  >
    <!-- TOP BAR -->
    <ProfileMainInfo :user-id="profileId" />

    <!-- ACCOUNT INFO -->
    <ProfileAccData />
  </div>
</template>

<style scoped>
::-webkit-scrollbar-track {
  background-color: #63117076;
  border-radius: 10px;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #861598;
}
</style>
