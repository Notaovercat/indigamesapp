<script setup lang="ts">
import { IGamePreview } from "@workspace/shared";
import { Bars3BottomLeftIcon } from "@heroicons/vue/20/solid";

definePageMeta({
  name: "all",
});

const games: Ref<IGamePreview[]> = ref([]);
const errorMsg = ref("");

const getGames = async () => {
  const { data, error } = await useMyFetch<IGamePreview[]>("games", {
    query: {
      ...useRoute().query,
    },
  });
  if (data.value) games.value = data.value;
  if (error.value) errorMsg.value = "Please, try again later";
};
await getGames();
watch(
  () => useRoute().query,
  async () => await getGames()
);
const sideBar = ref(false);
</script>

<template>
  <div
    class="max-w-screen-xl bg-[#241468] bg-opacity-80 text-white mx-auto flex flex-col my-5 pb-2 rounded-lg"
  >
    <section class="main m-2">
      <div class="grid md:grid-cols-4 grid-cols-1 gap-4">
        <div class="hidden md:block">
          <MainSideMenu />
        </div>

        <!-- MOBILE -->
        <!-- MOBILE SIDEBAR -->
        <div class="relative block md:hidden p-3">
          <button
            class="absolute left-0 top-0 z-50 bg-[#2e0d3f] p-2 rounded"
            @click="sideBar = !sideBar"
          >
            <Bars3BottomLeftIcon class="w-5" />
          </button>

          <div
            class="absolute left-0 top-8 min-h-screen w-2/3 bg-opacity-50 z-40"
            v-if="sideBar"
          >
            <MainSideMenu @click="sideBar = false" />
          </div>
        </div>

        <div
          v-if="sideBar"
          class="z-30 h-screen w-full flex absolute bg-black left-0 top-0 bg-opacity-60"
        ></div>

        <div class="col-span-3">
          <div
            class="flex flex-col pl-6 items-center md:items-start md:h-[72rem] overflow-y-scroll"
          >
            <h1 class="pt-2 font-bold text-3xl pb-6">
              All
              <span v-if="useRoute().query.genre">{{
                useRoute().query.genre
              }}</span>
              games
              <span v-if="useRoute().query.platform"
                >on {{ useRoute().query.platform }}</span
              >
            </h1>
            <ul
              v-if="games && games.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9"
            >
              <li v-for="game of games" :key="game.id">
                <MainGameCard :content="game" />
              </li>
            </ul>

            <!-- EMPTY -->
            <div v-else class="flex justify-center items-center h-56">
              <h1 v-if="errorMsg" class="text-3xl font-bold text-red-100">
                {{ errorMsg }}
              </h1>
              <h1 v-else class="text-3xl font-bold">There is empty...</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
::-webkit-scrollbar-track {
  background-color: #241468;
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
