import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";

import {
  getPokemon,
  getPokemonList,
  getPokemonSpecies,
  getPokemonEvolutions,
} from "@/shared/services/PokemonService";

export const pokedexQuery = (q: string | null) => ({
  queryKey: ["pokedex", "list", q ?? "all"],
  queryFn: async () => getPokemonList(),
});

export const pokemonDetailsQuery = (pokemonName: string) => ({
  queryKey: ["pokedex", "details", pokemonName],
  queryFn: async () => getPokemon(pokemonName),
});

const pokemonEvolutionQuery = (pokemon: any) => ({
  queryKey: ["pokedex", "evolution", `${pokemon.name}`],
  queryFn: async () => getPokemonEvolutions(pokemon),
});

const pokemonSpeciesQuery = (pokemon: any) => ({
  queryKey: ["pokedex", "species", `${pokemon.name}`],
  queryFn: async () => getPokemonSpecies(pokemon),
});

export type PokedexLoaderReturnType = Awaited<
  ReturnType<ReturnType<typeof pokedexLoader>>
>;

export const pokedexLoader = (queryClient: QueryClient) => async () => {
  const query = pokedexQuery("");

  const pokemons = await queryClient.ensureQueryData(query);

  return { pokemons };
};

export const pokemonDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const pokemonName = params.name as string;

    const query = pokemonDetailsQuery(pokemonName);
    const pokemon = await queryClient.ensureQueryData(query);

    const speciesQuery = pokemonSpeciesQuery(pokemon);
    const species = await queryClient.ensureQueryData(speciesQuery);

    const evolutionQuery = pokemonEvolutionQuery(pokemon);
    const evolutions = await queryClient.ensureQueryData(evolutionQuery);

    pokemon.species = species;
    // TODO: Map to Pokemon class

    return { pokemon, evolutions };
  };

export type CompletePokedexLoaderReturnType = Awaited<
  ReturnType<ReturnType<typeof pokedexLoader>>
>;

export const completePokedexLoader = (queryClient: QueryClient) => async () => {
  const pokedex = await queryClient.ensureQueryData(pokedexQuery(""));

  const pokemonDetailsPromises = pokedex.map(
    (pokemon: { name: string; url: string }) => {
      const pokemonDetailsQuery = pokemonDetailsLoader(queryClient)({
        params: { name: pokemon.name },
      } as any);

      return pokemonDetailsQuery;
    }
  );

  const completePokedex = await Promise.all(pokemonDetailsPromises);

  return { pokemons: completePokedex };
};
