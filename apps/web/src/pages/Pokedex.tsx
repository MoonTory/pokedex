import * as React from "react";
import { useSearchParams } from "react-router-dom";

import { usePokemon } from "@/context";
import { LoadingButton } from "@/components";
import Pokedex from "@/components/blocs/Pokedex";
import { POKEMON_TYPES } from "@/contants/pokemon-types";

const INITIAL_LIMIT = 50;

const safeParseFloat = (value: string) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed; // Return null if the value isn't a valid float
};

export const PokedexPage = () => {
  const [loading, setLoading] = React.useState(false);

  const [limit, setLimit] = React.useState(INITIAL_LIMIT);

  const [searchParams, setSearchParams] = useSearchParams();

  const { db, allPokemons, selectedTypes, setSelectedTypes } = usePokemon();

  const hasMore = allPokemons.length > limit;

  const search = searchParams.get("search");
  const typesString = searchParams.get("types");

  const minWeight = safeParseFloat(searchParams.get("minWeight") || "");
  const maxWeight = safeParseFloat(searchParams.get("maxWeight") || "");
  const minHeight = safeParseFloat(searchParams.get("minHeight") || "");
  const maxHeight = safeParseFloat(searchParams.get("maxHeight") || "");

  const [filtered, setFiltered] = React.useState(db.slice(0, limit));

  const next = () => setLimit(limit + INITIAL_LIMIT);

  React.useEffect(() => {
    const types = typesString
      ?.split(",")
      .map((t) => POKEMON_TYPES.find((pt) => pt.name === t))
      .filter((t) => !!t);

    setSelectedTypes(types ? types : []);

    if (!typesString)
      setSearchParams(() => ({ ...searchParams }), { replace: true });
  }, [typesString]);

  React.useEffect(() => {
    setLoading(true);
    setFiltered(
      allPokemons
        .filter((p) => {
          if (selectedTypes.length === 0) return true; // No type filter applied

          const pokemon = db.find((pokemon) => pokemon.name === p.name);

          if (!pokemon) return false;

          return selectedTypes.every((type) =>
            pokemon.types.some((pt) => pt.name === type.name)
          );
        })
        .filter((p) => {
          const pokemon = db.find((pokemon) => pokemon.name === p.name);

          if (!pokemon) return false;

          const height = pokemon.height;

          return (
            (!minHeight || height >= minHeight) &&
            (!maxHeight || height <= maxHeight)
          );
        })
        .filter((p) => {
          const pokemon = db.find((pokemon) => pokemon.name === p.name);

          if (!pokemon) return false;

          const weight = pokemon.weight;
          return (
            (!minWeight || weight >= minWeight) &&
            (!maxWeight || weight <= maxWeight)
          );
        })
        .filter((p) => p.name.includes(search || ""))
        .slice(0, limit)
    );

    setLoading(false);
  }, [
    allPokemons,
    limit,
    search,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
    selectedTypes,
  ]);

  return (
    <div className="p-4">
      <Pokedex pokemons={filtered} />

      <div className="flex justify-center w-full py-8">
        <LoadingButton onClick={next} disabled={!hasMore} loading={loading}>
          Load more
        </LoadingButton>
      </div>
    </div>
  );
};
