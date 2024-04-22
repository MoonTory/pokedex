import * as React from "react";
import { useLoaderData, useParams, useSearchParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import Pokedex from "@/components/blocs/Pokedex";
import { trainerCollectionQuery } from "@/routes/loaders/trainers.loader";

const INITIAL_LIMIT = 40;

export const TrainerCollectionPage = () => {
  const { trainerId } = useParams<{ trainerId: string }>();

  const { data: collection } = useQuery({
    ...trainerCollectionQuery(trainerId ?? "1"),
    refetchInterval: 1000 * 60 * 5,
  });

  collection?.map((col) => ({ ...col, name: col.pokemonId }));

  const [searchParams] = useSearchParams({
    search: "",
  });

  const pokemonSearch = searchParams.get("search");

  const [limit, setLimit] = React.useState(INITIAL_LIMIT);

  React.useEffect(() => {}, [pokemonSearch]);

  React.useEffect(() => setLimit(INITIAL_LIMIT), []);

  return (
    <div className="p-4 py-5">
      <Pokedex pokemons={(collection ? collection : []).slice(0, limit)} />
    </div>
  );
};
