// https://tkdodo.eu/blog/react-query-meets-react-router
// https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { trainersPageLoader } from "./loaders/trainers.loader";
import { pokemonDetailsLoader } from "./loaders/pokedex.loader";

import {
  ErrorPage,
  LoginPage,
  PokedexPage,
  PokemonDetailsPage,
  TrainerCollectionPage,
} from "@/pages";

import {
  queryClient,
  localStoragePersister as persister,
} from "@/lib/react-query";

import { useAuth, usePokemon } from "@/context";
import { RootLayout } from "@/components/blocs/RootLayout";

import { PrivateRoute } from "./PrivateRoute";
import { loginAction } from "./actions/login.action";

export const Router: React.FC = () => {
  const auth = useAuth();
  const pokemonContext = usePokemon();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <RootLayout />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <PokedexPage />,
        },
        {
          path: "pokemon/:name",
          element: <PokemonDetailsPage />,
          loader: pokemonDetailsLoader(queryClient),
        },
        {
          path: "trainer/:trainerId/collection",
          element: <TrainerCollectionPage />,
          loader: trainersPageLoader(pokemonContext),
        },
      ],
    },
    {
      path: "/login",
      action: loginAction(auth),
      element: <LoginPage />,
    },
  ]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};
