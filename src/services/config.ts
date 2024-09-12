import { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000,
      gcTime: 1000,
    },
    mutations: {
      retry: false,
    },
  },
} satisfies QueryClientConfig;
