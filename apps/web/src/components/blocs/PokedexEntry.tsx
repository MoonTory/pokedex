import * as React from "react";
import { useNavigate } from "react-router";
import { EllipsisVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn, stopPropagation } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { pokemonDetailsQuery } from "@/routes/loaders/pokedex";
import { colorByType } from "@/contants/pokemon-color";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useSearchParams } from "react-router-dom";

const PokedexEntry: React.FC<{ name: string }> = ({ name }) => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams({
    tags: [],
  });

  const { data: pokemon, isLoading } = useQuery(pokemonDetailsQuery(name));

  const [isHovered, setIsHovered] = React.useState(false);

  const [showShiny, setShowShiny] = useLocalStorage<boolean>(
    `shiny_${name}`,
    false
  );

  const toggleHover = () => setIsHovered(!isHovered);

  const renderShinySprite = (pokemon: any) =>
    pokemon?.sprites.versions["generation-v"]["black-white"].front_shiny;

  const renderSprite = (pokemon: any) =>
    pokemon?.sprites.versions["generation-v"]["black-white"].front_default;

  const handleClick = () => navigate(`/pokemon/${name}`);

  const handleTagClick = (e: any) => (tag: string) => {
    stopPropagation(e);

    const tags = (searchParams.get("tags") || "").split(",");

    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];

    setSearchParams({
      tags: newTags.join(","),
    });
  };

  return (
    <article
      onClick={handleClick}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      className={cn(
        isHovered && "hover:border-slate-200",
        "text-center bg-white dark:bg-background rounded-[10px] relative font-semibold capitalize pb-4 shadow-lg shadow-slate-400/10 border-2 border-transparent cursor-pointer group grid gap-2"
      )}
    >
      <header className="h-9 flex justify-between">
        <img src={`/pokeball_caught.png`} className="m-1 h-[16px] w-[16px]" />

        <LoadingSkeleton
          isLoading={isLoading}
          className="h-12 w-12 absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2  transition-transform pixelated rounded-full"
        >
          <img
            className={cn(
              isHovered && "hover:scale-110",
              "absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2  transition-transform pixelated size-[96px]"
            )}
            src={showShiny ? renderShinySprite(pokemon) : renderSprite(pokemon)}
            alt={`${pokemon?.name} image`}
          />
        </LoadingSkeleton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical
              onClick={stopPropagation}
              onMouseEnter={toggleHover}
              onMouseLeave={toggleHover}
              className="m-1 p-[2px] h-[20px] w-[20px] justify-self-end hover:bg-slate-200 hover:rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showShiny}
              onClick={stopPropagation}
              onCheckedChange={setShowShiny}
            >
              Shiny
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <LoadingSkeleton isLoading={isLoading} width={20}>
        <span className="text-sm text-slate-400">N° {pokemon?.id}</span>
      </LoadingSkeleton>

      <LoadingSkeleton isLoading={isLoading} width={100}>
        <h4 className="text-lg">{pokemon?.name}</h4>
      </LoadingSkeleton>

      <LoadingSkeleton isLoading={isLoading} width={150}>
        <ul className="flex gap-2 justify-center">
          {pokemon?.types.map((type: any) => (
            <li
              onClick={(e) => handleTagClick(e)(type.type.name)}
              onMouseEnter={toggleHover}
              onMouseLeave={toggleHover}
              className={`p-1 rounded-md px-2 text-white text-sm hover:scale-110 ${
                colorByType[type.type.name as keyof typeof colorByType]
              }`}
              key={type.type.name}
            >
              {type.type.name}
            </li>
          ))}
        </ul>
      </LoadingSkeleton>
    </article>
  );
};
export default PokedexEntry;
