export const useMyFetch: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.API_URL;
  return useFetch(request, {
    ...opts,
    baseURL,
    credentials: "include",
    watch: false,
  });
};
