import { QueryClient } from "@tanstack/react-query";

export const CACHE_MAX_AGE = 1000 * 60 * 60 * 24; // 24h

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: CACHE_MAX_AGE,
      },
    },
  });
}
