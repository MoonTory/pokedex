// https://tkdodo.eu/blog/react-query-meets-react-router
// https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import { trainersPageLoader } from "./loaders/trainers";
import { pokedexLoader, pokemonDetailsLoader } from "./loaders/pokedex";

import { PokedexPage } from "@/pages/Pokedex";
import { RootLayout } from "@/components/blocs/RootLayout";
import { PokemonDetailsPage } from "@/pages/PokemonDetails";
import { TrainerCollectionPage } from "@/pages/TrainerCollection";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: pokedexLoader(queryClient),
    children: [
      {
        index: true,
        element: <PokedexPage />,
        loader: pokedexLoader(queryClient),
      },
      {
        path: "pokemon/:name",
        element: <PokemonDetailsPage />,
        loader: pokemonDetailsLoader(queryClient),
      },
      {
        path: "trainer/:trainerId",
        element: <TrainerCollectionPage />,
        loader: trainersPageLoader(queryClient),
      },
    ],
  },
]);

export const Router = () => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
  >
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </PersistQueryClientProvider>
);
