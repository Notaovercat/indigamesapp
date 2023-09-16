<script setup lang="ts">
import { IGamePreview } from "@/types/games/gamePreview.interface";

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

        <div class="col-span-3">
          <div
            class="flex flex-col pl-6 items-center md:items-start md:h-[72rem] overflow-hidden"
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
