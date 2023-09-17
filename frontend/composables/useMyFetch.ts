export const useMyFetch: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;

  return useFetch(request, {
    ...opts,
    baseURL: apiUrl,
    credentials: "include",
    watch: false,
  });
};
