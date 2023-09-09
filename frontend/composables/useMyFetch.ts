export const useMyFetch: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.API_URL;

  return useFetch(request, {
    baseURL: apiUrl,
    credentials: "include",
    ...opts,
  });
};
