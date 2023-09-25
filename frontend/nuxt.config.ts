// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false,
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "nuxt-time"],
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
  plugins: ["@/plugins/domPurify.plugin", "@/plugins/socketClient.plugin"],
  imports: {
    dirs: ["stores"],
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      SOCKET_URL: process.env.SOCKET_URL,
    },
  },
  routeRules: {
    "games/upload": { ssr: false },
    "games/*/manage": { ssr: false },
    "games/my/**": { ssr: false },
  },
});
