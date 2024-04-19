import { useLoaderData } from "react-router-dom";

import PokedexEntryDetail from "@/components/blocs/PokemonEntryDetails";

export const PokemonDetailsPage = () => {
  const { pokemon, evolutions } = useLoaderData() as any;

  return (
    <div className="p-4 py-5">
      <div className="pt-16">
        <PokedexEntryDetail pokemon={pokemon} evolutions={evolutions} />
      </div>
    </div>
  );
};
