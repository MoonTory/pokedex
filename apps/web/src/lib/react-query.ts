import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});
