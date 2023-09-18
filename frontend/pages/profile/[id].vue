<script setup lang="ts">
definePageMeta({
  name: "profile",
});

const route = useRoute();
const authStore = useAuth();
const profileId = route.params["id"] as string;
let isYourProfile = false;

const profileStore = useProfile();
isYourProfile = profileId === authStore.userId;

await Promise.all([
  profileStore.getProfileGames(profileId, isYourProfile),
  profileStore.getProfileTeams(profileId, isYourProfile),
  profileStore.getProfile(profileId),
]);

onDeactivated(() => {
  profileStore.reset();
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
