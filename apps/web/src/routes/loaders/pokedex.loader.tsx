import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";

import {
  getPokemon,
  getPokemonList,
  getPokemonSpecies,
  getPokemonEvolutions,
  getPokemonById,
} from "@/shared/services/PokemonService";

export const completePokedexQuery = (limit: number) => ({
  queryKey: ["pokedex", "list", limit],
  queryFn: async () => {
    // Fetch the list of Pokemon
    const pokedex = await getPokemonList(limit);

    // Fetch the details for each Pokemon
    const pokemonDetailsPromises = pokedex.map(async (pokemon) => {
      const details = await getPokemon(pokemon.name);
      const evolution = await getPokemonEvolutions(details);
      return {
        ...details,
        evolution,
        name: details.name,
      };
    });

    const completePokedex = await Promise.all(pokemonDetailsPromises);

    return completePokedex;
  },
});

export const pokedexQuery = (q: string | null, limit: number = 40) => ({
  queryKey: ["pokedex", "list", q ?? "all", limit ?? 40],
  queryFn: async () => getPokemonList(limit),
});

export const pokemonDetailsQuery = (id: string) => ({
  queryKey: ["pokedex", "details", id],
  queryFn: async () => getPokemonById(id),
});

export const pokemonEvolutionQuery = (pokemon: any, addDetails?: boolean) => ({
  queryKey: ["pokedex", "evolution", `${pokemon.name}`],
  queryFn: async () => getPokemonEvolutions(pokemon, addDetails),
});

const pokemonSpeciesQuery = (pokemon: any) => ({
  queryKey: ["pokedex", "species", `${pokemon.name}`],
  queryFn: async () => getPokemonSpecies(pokemon),
});

export const pokemonDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const pokemonName = params.name as string;

    const query = pokemonDetailsQuery(pokemonName);
    const pokemon = await queryClient.ensureQueryData(query);

    const speciesQuery = pokemonSpeciesQuery(pokemon);
    const species = await queryClient.ensureQueryData(speciesQuery);

    const evolutionQuery = pokemonEvolutionQuery(pokemon, true);
    const evolutions = await queryClient.ensureQueryData(evolutionQuery);

    (pokemon as any).species = species;

    return { pokemon, evolutions };
  };
