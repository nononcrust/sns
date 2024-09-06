import { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
} satisfies QueryClientConfig;
