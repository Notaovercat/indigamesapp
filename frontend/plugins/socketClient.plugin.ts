import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  // const url = config.API_URL;
  const url = config.SOCKET_URL;

  const socket = io(`${url}/comments`, {
    autoConnect: false,
    withCredentials: true,
  });

  return {
    provide: {
      io: socket,
    },
  };
});
