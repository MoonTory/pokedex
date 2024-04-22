import { PokemonDef } from "../../types";
import { getPokemonEvolutionsByName } from "../../services/PokemonService";
import { AbstractPokemon } from "./AbstractPokemon";

export class Pokemon extends AbstractPokemon {
  private evolutions: any[] = [];

  constructor(pokemon: PokemonDef.Pokemon, evolutions?: any[]) {
    super(pokemon);

    this.evolutions = evolutions || [];
  }

  // used for testing.
  async ready() {
    await this.initialize();
  }

  async initialize() {
    this.evolutions = await getPokemonEvolutionsByName(this.name);
  }

  getName(): string {
    return this.name;
  }

  getTypesString(): string[] {
    return this.types.map(({ name }) => name);
  }

  getTypes() {
    return this.types;
  }

  getWeight(): number {
    return this.weight;
  }

  getHeight(): number {
    return this.height;
  }

  getOrder(): number {
    return this.order;
  }

  getEvolutions(): string[] {
    return this.evolutions;
  }

  getNextEvolutionName(): string {
    const currentIndex = this.evolutions.findIndex(
      (evo: any) => evo.species.name === this.name
    );

    if (currentIndex === -1 || currentIndex === this.evolutions.length - 1) {
      return "";
    }

    return this.evolutions[currentIndex + 1].species.name;
  }
}
