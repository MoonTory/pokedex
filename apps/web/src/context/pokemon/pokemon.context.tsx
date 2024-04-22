import React from "react";

import { IPokemonContext } from "./types";

import { fetchUrl } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { PokemonService } from "@/shared/services";
import { POKEMON_API_URL } from "@/shared/services/PokemonService";
import { Pokemon } from "@/shared/classes/Pokemon/Pokemon";
import {
  pokedexQuery,
  pokemonDetailsQuery,
  pokemonEvolutionQuery,
} from "@/routes/loaders/pokedex.loader";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PokemonDef } from "@/shared/types";

function mapToIndexed(pokemon: { name: string; url: string }): {
  name: string;
  url: string;
  id: number;
} {
  return {
    url: pokemon.url,
    name: pokemon.name,
    id: parseInt(pokemon.url.split("/")[6]),
  };
}

export interface PokemonByTypeListResponse {
  id: number;
  pokemon: { name: string; url: string }[];
}

export const PokemonContext = React.createContext({} as any as IPokemonContext);

export const PokemonProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [pokedex, setPokedex] = useLocalStorage<any>("pokedex", "[]");
  const [db, setDB] = React.useState<Pokemon[]>(
    pokedex ? JSON.parse(pokedex).map((p: any) => new Pokemon(p)) : []
  );
  const [loading, setLoading] = React.useState(false);
  const [allPokemons, setAllPokemons] = React.useState<any[]>([]);
  const [selectedTypes, setSelectedTypes] = React.useState<any[]>([]);
  const [nextUrl, setNextUrl] = React.useState<string | null>(
    POKEMON_API_URL + "?limit=1500"
  );

  React.useEffect(() => {
    seedDB();
  }, []);

  React.useEffect(() => {
    fetchPokemons();
  }, [selectedTypes]);

  const seedDB = async () => {
    const pokemons = await queryClient.ensureQueryData(
      pokedexQuery("all", 1500)
    );

    // Function to initialize and prepare a single Pokemon
    const initPokemon = async (p: any) => {
      const def = await queryClient.ensureQueryData(pokemonDetailsQuery(p.id));

      const pokemon = new Pokemon(def);

      return pokemon;
    };

    // Function to process a batch of Pokemon concurrently
    const processBatch = async (batch: PokemonDef.Pokemon[]) => {
      return Promise.all(batch.map((p) => initPokemon(p)));
    };

    // Function to process all batches with a delay between each batch
    const batchProcessPokemons = async (
      pokemons: any,
      batchSize: number,
      delay: number
    ) => {
      const pokemonsWithEvolutions = [];
      for (let i = 0; i < pokemons.length; i += batchSize) {
        const batch = pokemons.slice(i, i + batchSize);
        const batchResults = await processBatch(batch);
        pokemonsWithEvolutions.push(...batchResults);
        setDB([...batchResults]);
        if (i + batchSize < pokemons.length) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      return pokemonsWithEvolutions;
    };

    // Process all Pokemon in batches of 50 with a 500 milliseconds delay between each batch
    const pokemonsWithEvolutions = await batchProcessPokemons(
      pokemons
        .filter((p: any) => {
          // remove all pokemon that have [deoxys, wormadam] in their name by using regex so 'deoxys-normal' is also removed
          return !/(deoxys|wormadam)/.test(p.name);
        })
        .map((p) => mapToIndexed(p)),
      50,
      100
    );

    setDB(pokemonsWithEvolutions);
  };

  const fetchPokemonsByType = async () => {
    if (selectedTypes.length === 0) return;

    const fetchPromises = selectedTypes.map((type) =>
      fetchUrl<PokemonByTypeListResponse>(type.url).then((res) =>
        res.pokemon.map((p: any) => mapToIndexed(p.pokemon))
      )
    );

    const results = await Promise.all(fetchPromises);

    const commonPokemons = results.reduce((acc, pokemons, index) => {
      if (index === 0) {
        return pokemons;
      } else {
        return acc.filter((accPokemon) =>
          pokemons.some((pokemon) => pokemon.id === accPokemon.id)
        );
      }
    });

    setAllPokemons(commonPokemons);
    setNextUrl(POKEMON_API_URL + "?limit=1500");
  };

  const fetchPokemons = async () => {
    setLoading(true);

    if (selectedTypes.length > 0) {
      fetchPokemonsByType();
    } else if (nextUrl) {
      const result = await PokemonService.fetchPokemonList(nextUrl);

      setNextUrl(result.next);
      setAllPokemons([...result.results.map((r) => mapToIndexed(r))]);
    }

    setLoading(false);
  };

  return (
    <PokemonContext.Provider
      value={{
        db,
        loading: loading,
        hasMore: !!nextUrl,
        selectedTypes,
        setSelectedTypes,
        fetchPokemonsByType,
        allPokemons: allPokemons,
        fetchNextPage: fetchPokemons,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = React.useContext(PokemonContext);

  if (context === undefined)
    throw new Error("usePokemon must be used within a PokemonProvider");

  return context;
};
