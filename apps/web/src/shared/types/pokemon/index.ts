export interface Pokemon {
  id: string;
  name: string;
  order: number;
  height: number;
  weight: number;
  types: PokemonType[];
}

export interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};
