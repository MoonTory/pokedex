export interface Pokemon {
  name: string;
  types: { type: { name: string }; url: string }[];
  weight: number;
  height: number;
  order: number;
}

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};
