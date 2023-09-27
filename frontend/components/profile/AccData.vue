<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

const categories = reactive([
  {
    id: 1,
    name: "Created games",
  },
  {
    id: 2,
    name: "Member of",
  },
  // {
  //   id: 3,
  //   name: "Comments",
  // },
]);
</script>

<template>
  <TabGroup
    vertical
    as="div"
    class="flex flex-col md:flex-row md:justify-between w-full h-full md:h-[33rem] p-2 gap-3"
  >
    <TabList
      as="ul"
      class="flex flex-col gap-4 text-xl bg-[#332088] rounded shadow w-full md:w-1/4 p-2 items-center"
    >
      <Tab
        as="li"
        v-slot="{ selected }"
        v-for="cat in categories"
        :key="cat.id"
        class="w-full focus:outline-none"
      >
        <button
          :class="[
            'w-full rounded-lg py-2.5 text-2xl font-medium leading-5 block',
            selected
              ? 'shadow-xl bg-[#EA1179] '
              : 'text-white hover:bg-[#EA1179] ',
          ]"
        >
          {{ cat.name }}
        </button>
      </Tab>
    </TabList>
    <div
      class="add-data-container w-full md:w-3/4 md:h-[30rem] overflow-y-scroll"
    >
      <TabPanels>
        <TabPanel>
          <ProfileCreatedGames />
        </TabPanel>
        <TabPanel>
          <ProfileTeamMember />
        </TabPanel>
        <TabPanel>
          <ProfileComments />
        </TabPanel>
      </TabPanels>
    </div>
  </TabGroup>
</template>
