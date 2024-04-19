import { fetchUrl } from "@/lib/axios";
import { PaginationResponse } from "@/shared/types/pagination-response";

type PokemonListResponse = PaginationResponse<{ name: string; url: string }>;

const BASE_URL = "https://pokeapi.co/api/v2/";

export async function getPokemonList() {
  const { results } = await fetchUrl<PokemonListResponse>(
    `${BASE_URL}pokemon?limit=1400`
  );

  return results;
}

export async function getPokemonCompleteData(pokemonName: string) {
  const pokemonData = await fetchUrl(`${BASE_URL}pokemon/${pokemonName}`);

  return pokemonData;
}

export async function getPokemonSpecies(pokemonData: any) {
  const speciesData = await fetchUrl(pokemonData.species.url);

  return speciesData;
}

export async function getPokemonEvolutionsByName(
  pokemonName: any,
  addDetails?: boolean
) {
  const pokemonData = await fetchUrl(`${BASE_URL}pokemon/${pokemonName}`);
  const speciesData = await fetchUrl(pokemonData.species.url);
  const evolutionChainData = await fetchUrl(speciesData.evolution_chain.url);

  return await extractEvolutions(evolutionChainData.chain, addDetails);
}

export async function getPokemonEvolutions(pokemonData: any) {
  const speciesData = await fetchUrl(pokemonData.species.url);
  const evolutionChainData = await fetchUrl(speciesData.evolution_chain.url);

  return await extractEvolutions(evolutionChainData.chain);
}

export async function getPokemon(pokemonName: string) {
  return await fetchUrl(`${BASE_URL}pokemon/${pokemonName}`);
}

async function extractEvolutions(
  currentStage: any,
  addDetails?: boolean
): Promise<any[]> {
  let evolutions: any[] = [];

  async function fetchEvolutionDetails(stage: any) {
    const pokemonDetails = await getPokemonCompleteData(stage.species.name);

    if (addDetails) {
      stage.pokemon = pokemonDetails;
    }

    evolutions.push(stage);

    for (let i = 0; i < stage.evolves_to.length; i++) {
      await fetchEvolutionDetails(stage.evolves_to[i]);
    }
  }

  await fetchEvolutionDetails(currentStage);

  return evolutions;
}
