<script setup lang="ts">
import { STATUS } from "@workspace/shared";

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
    status: "InDevelopment",
    color: "text-blue-500",
  },
  {
    name: "Early Access",
    status: "EarlyAccess",
    color: "text-orange-500",
  },
  {
    name: "Released",
    status: "Released",
    color: "text-green-500",
  },
  {
    name: "Not Provided",
    status: "NonProvided",
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
