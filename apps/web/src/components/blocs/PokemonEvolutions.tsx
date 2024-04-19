import { useNavigate } from "react-router";

export const PokemonEvolutions = ({ evolutions }: any) => {
  const navigate = useNavigate();

  const renderSprite = (pokemon: any) =>
    pokemon?.sprites.versions["generation-v"]["black-white"].front_default;

  return (
    <div className="flex justify-center items-center gap-2 flex-wrap">
      {evolutions.map((evolution: any, index: number) => (
        <article
          key={evolution.pokemon.name}
          className="flex gap-2 items-center"
        >
          {index !== 0 && (
            <div className="bg-slate-100 dark:bg-zinc-900 p-2 rounded-full text-sm font-bold">
              <span>Min. Lv. {evolution.evolution_details[0].min_level}</span>
            </div>
          )}
          <button
            onClick={() => navigate(`/pokemon/${evolution.pokemon.name}`)}
            className="hover:bg-slate-100 transition-colors rounded-3xl"
          >
            <img
              className="cursor-pointer"
              src={renderSprite(evolution.pokemon)}
              alt={`${evolution.pokemon.name}-image`}
            />
          </button>
        </article>
      ))}
    </div>
  );
};
