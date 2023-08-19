<template>
  <div
    class="max-w-7xl bg-[#241468] text-white mx-auto flex flex-col my-5 rounded-lg"
  >
    <section class="banner max-w-7xl m-2">
      <MainBanner />
    </section>

    <section class="main m-2">
      <div class="grid md:grid-cols-4 grid-cols-1 gap-4">
        <div class="hidden md:block">
          <MainSideMenu />
        </div>

        <div class="col-span-3">
          <MainFeaturedGames />
          <MainLastUpdated />
        </div>
      </div>
    </section>
  </div>
</template>
