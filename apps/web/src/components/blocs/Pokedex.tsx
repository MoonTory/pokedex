import PokedexEntry from "./PokedexEntry";

const Pokedex: React.FC<{ pokemons: any[] }> = ({ pokemons }) => {
  return (
    <section className="pt-14 grid grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] gap-4 gap-y-14">
      {pokemons.map((pokemon: any) => (
        <PokedexEntry
          key={pokemon.url}
          name={pokemon.name || pokemon.pokemonId}
        />
      ))}
    </section>
  );
};

export default Pokedex;
