import { Pokemon } from "@/shared/classes/Pokemon/Pokemon";

export type PokemonState = {
  loading: boolean;
  allPokemon: Pokemon[];
  nextUrl: string | null;
};

export interface IPokemonContext {
  loading: boolean;
  db: Pokemon[];
  allPokemons: Pokemon[];
  hasMore: boolean;
  selectedTypes: any[];
  setSelectedTypes: React.Dispatch<any>;
  fetchNextPage: () => Promise<void>;
  fetchPokemonsByType: () => Promise<void>;
}
