<script setup lang="ts">
interface Props {
  active: boolean;
}

const { active } = defineProps<Props>();
const useAuthStore = useAuth();
const profileId = computed(() => useAuthStore.userId);
</script>

<template>
  <NuxtLink
    :to="{ name: 'profile', params: { id: profileId } }"
    :class="[
      active ? 'bg-gray-100' : '',
      'block px-4 py-2 text-sm text-gray-700',
    ]"
  >
    Open Profile
  </NuxtLink>
</template>
