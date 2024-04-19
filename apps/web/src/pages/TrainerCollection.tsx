import * as React from "react";
import { useLoaderData, useParams, useSearchParams } from "react-router-dom";

import Pokedex from "@/components/blocs/Pokedex";
import { useIntersectionObserver } from "@/hooks";
import {
  trainersPageLoader,
  trainerCollectionQuery,
} from "@/routes/loaders/trainers";
import { useQuery } from "@tanstack/react-query";

const INITIAL_LIMIT = 40;
const INCREASE_LIMIT = 20;

export const TrainerCollectionPage = () => {
  const { pokemons, collection: initialData } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof trainersPageLoader>>
  >;

  const { trainerId } = useParams<{ trainerId: string }>();

  const { data: collection } = useQuery({
    ...trainerCollectionQuery(parseInt(trainerId ?? "1")),
    initialData,
    refetchInterval: 1000 * 60 * 5,
  });

  collection.map((col) => ({ ...col, name: col.pokemonId }));

  const [searchParams] = useSearchParams({
    search: "",
  });

  const pokemonSearch = searchParams.get("search");

  const [limit, setLimit] = React.useState(INITIAL_LIMIT);

  const targetObserver = React.useRef(null);
  const entry = useIntersectionObserver(targetObserver, {});
  const isVisible = !!entry?.isIntersecting;

  const pokemonsByName = (pokemons as any).filter((pokemon: any) =>
    pokemon.name.includes(pokemonSearch)
  );

  React.useEffect(() => {
    const maxPokemons = pokemonsByName.length;
    if (isVisible && maxPokemons !== 0) {
      const newLimit = limit + INCREASE_LIMIT;
      newLimit > maxPokemons ? setLimit(maxPokemons) : setLimit(newLimit);
    }
  }, [isVisible]);

  React.useEffect(() => setLimit(INITIAL_LIMIT), [pokemonSearch]);

  return (
    <div className="p-4 py-5">
      <Pokedex pokemons={collection.slice(0, limit)} />

      <span ref={targetObserver}></span>
    </div>
  );
};
