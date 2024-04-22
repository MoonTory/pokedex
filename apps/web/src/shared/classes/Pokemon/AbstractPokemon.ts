import { PokemonDef } from "../../types";

export abstract class AbstractPokemon {
  id: string;
  name: string;
  weight: number;
  height: number;
  order: number;
  types: { name: string; url: string }[];

  constructor(pokemon: PokemonDef.Pokemon) {
    this.id = pokemon.id;
    this.name = pokemon.name;
    this.order = pokemon.order;
    this.weight = pokemon.weight;
    this.height = pokemon.height;
    this.types = pokemon.types.map((type) => ({
      name: type.type.name,
      url: type.type.url,
    }));
  }

  abstract getName(): string;
  abstract getTypesString(): string[];
  abstract getTypes(): { name: string; url: string }[];
  abstract getWeight(): number;
  abstract getHeight(): number;
  abstract getOrder(): number;
  abstract getEvolutions(): unknown;
  abstract getNextEvolutionName(): string;
}
