import * as React from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import Pokedex from "@/components/blocs/Pokedex";
import { PokedexLoaderReturnType } from "@/routes/loaders/pokedex";
import { useIntersectionObserver } from "@/hooks";

const INITIAL_LIMIT = 40;
const INCREASE_LIMIT = 20;

export const PokedexPage = () => {
  const { pokemons: allPokemons } = useLoaderData() as PokedexLoaderReturnType;

  const [searchParams] = useSearchParams({
    search: "",
  });

  const pokemonSearch = searchParams.get("search");

  const [limit, setLimit] = React.useState(INITIAL_LIMIT);

  const targetObserver = React.useRef(null);
  const entry = useIntersectionObserver(targetObserver, {});
  const isVisible = !!entry?.isIntersecting;

  const pokemonsByName = (allPokemons as any).filter((pokemon: any) =>
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
      <Pokedex pokemons={pokemonsByName.slice(0, limit)} />

      <span ref={targetObserver}></span>
    </div>
  );
};
