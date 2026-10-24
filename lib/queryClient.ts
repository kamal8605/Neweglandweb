import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes — catalogue data changes infrequently
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Server: a new client for every render, so no query cache is shared between requests or users (a module-level
 * client would live for the whole server process, and server-side queries are never garbage-collected).
 * Browser: one client for the life of the tab, so cached queries survive client-side navigation.
 */
export function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
