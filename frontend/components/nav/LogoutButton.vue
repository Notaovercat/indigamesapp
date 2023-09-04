<script setup lang="ts">
interface Props {
  active: boolean;
}

const { active } = defineProps<Props>();

const useAuthStore = useAuth();

const handleLogout = async () => await useAuthStore.logOut();
</script>

<template>
  <button
    @click="handleLogout"
    :class="[
      active ? 'bg-gray-100' : '',
      'block w-full text-start px-4 py-2 text-sm text-gray-700',
    ]"
  >
    Logout
  </button>
</template>
