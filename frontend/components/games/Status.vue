<script setup lang="ts">
import { STATUS } from "@/types/games/game.interface";

interface Props {
  status: STATUS;
}

interface Status {
  name: string;
  status: STATUS;
  color: string;
}

const statuses: Status[] = [
  {
    name: "Under Development",
    status: STATUS.InDevelopment,
    color: "text-blue-500",
  },
  {
    name: "Early Access",
    status: STATUS.EarlyAccess,
    color: "text-orange-500",
  },
  {
    name: "Released",
    status: STATUS.Released,
    color: "text-green-500",
  },
  {
    name: "Not Provided",
    status: STATUS.NonProvided,
    color: "text-gray-500",
  },
];

const { status } = defineProps<Props>();
const currentStatus = statuses.find((stat) => stat.status === status);
</script>

<template>
  <p class="flex items-center gap-1" v-if="currentStatus">
    Status:
    <span :class="['pl-1 pb-1', currentStatus.color]">●</span>
    <span class="font-bold">
      {{ currentStatus.name }}
    </span>
  </p>
</template>
