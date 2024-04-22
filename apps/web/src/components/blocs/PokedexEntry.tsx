import * as React from "react";
import { useNavigate } from "react-router";
import { EllipsisVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import {
  Badge,
  DropdownMenu,
  LoadingSkeleton,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui";
import { useAuth } from "@/context";
import { cn, stopPropagation } from "@/lib/utils";

import { colorByType } from "@/contants/pokemon-color";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import { pokemonDetailsQuery } from "@/routes/loaders/pokedex.loader";
import { trainerCollectionQuery } from "@/routes/loaders/trainers.loader";
import { TrainerService } from "@/shared/services";
import { useToast } from "@/hooks/use-toast";

const PokedexEntry: React.FC<{ name: string }> = ({ name }) => {
  const { toast } = useToast();

  const navigate = useNavigate();

  const {
    state: { user },
  } = useAuth();

  const { data: collection, refetch } = useQuery({
    ...trainerCollectionQuery(user?.id ?? "1"),
    refetchInterval: 1000 * 60 * 5,
  });

  const [searchParams, setSearchParams] = useSearchParams({
    types: [],
  });

  const { data: pokemon, isLoading } = useQuery(pokemonDetailsQuery(name));

  const [isHovered, setIsHovered] = React.useState(false);

  const [showShiny, setShowShiny] = useLocalStorage<boolean>(
    `shiny_${name}`,
    false
  );

  const findInCollection = (pokemonId?: string) =>
    collection?.find((c) => c.pokemonId === pokemonId);

  const [isCaught, setIsCaught] = React.useState(
    findInCollection(pokemon?.id)?.caught
  );

  const [isEncountered, setIsEncountered] = React.useState(
    findInCollection(pokemon?.id)?.encountered
  );

  React.useEffect(() => {
    setIsCaught(findInCollection(pokemon?.id)?.caught);
    setIsEncountered(findInCollection(pokemon?.id)?.encountered);
  }, [collection]);

  const toggleHover = () => setIsHovered(!isHovered);

  const renderShinySprite = (pokemon: any) =>
    pokemon?.sprites.versions["generation-v"]["black-white"].front_shiny;

  const renderSprite = (pokemon: any) =>
    pokemon?.sprites.versions["generation-v"]["black-white"].front_default;

  const handleClick = () => navigate(`/pokemon/${name}`);

  const handleCaughtClick = async (e: any) => {
    stopPropagation(e);

    let record = findInCollection(pokemon?.id);

    if (!record) {
      await TrainerService.addPokemonRecord(user!.id, pokemon!.id, false, true);
    } else {
      record = await TrainerService.updatePokemonRecord(
        user!.id,
        pokemon!.id,
        record.encountered,
        !record.caught
      );
    }

    await refetch();

    toast({
      title: "Pokemon Caught",
      description: `You ${isCaught ? "removed" : "added"} ${
        pokemon?.name
      } to your collection`,
    });
  };

  const handleEncounteredClick = async (e: any) => {
    stopPropagation(e);

    let record = findInCollection(pokemon?.id);

    if (!record) {
      await TrainerService.addPokemonRecord(user!.id, pokemon!.id, true, false);
    } else {
      record = await TrainerService.updatePokemonRecord(
        user!.id,
        pokemon!.id,
        !record.encountered,
        record.caught
      );
    }

    await refetch();

    toast({
      title: "Pokemon Encountered",
      description: `You ${isCaught ? "removed" : "added"} ${
        pokemon?.name
      } to your collection`,
    });
  };

  const handleTagClick = (e: any) => (type: string) => {
    stopPropagation(e);

    const types = (searchParams.get("types") || "").split(",");

    const newTypes = types.includes(type)
      ? types.filter((t) => t !== type)
      : [...types, type];

    setSearchParams(
      (prev) => {
        prev.set("types", newTypes.join(","));

        return prev;
      },
      { replace: true }
    );
  };

  const renderPokeballImage = () => {
    if (isCaught)
      return (
        <img src={`/pokeball_caught.png`} className="m-1 h-[16px] w-[16px]" />
      );

    if (isEncountered)
      return (
        <img
          src={`/pokeball_encountered.png`}
          className="m-1 h-[16px] w-[16px]"
        />
      );

    return null;
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
        {renderPokeballImage()}

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
            <DropdownMenuLabel>Collection</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={isCaught}
              onClick={handleCaughtClick}
            >
              Caught
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isEncountered}
              onClick={handleEncounteredClick}
            >
              Encountered
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
            <Badge
              onClick={(e) => handleTagClick(e)(type.type.name)}
              onMouseEnter={toggleHover}
              onMouseLeave={toggleHover}
              className={`text-sm hover:scale-110 ${
                colorByType[type.type.name as keyof typeof colorByType]
              }`}
              key={type.type.name}
            >
              {type.type.name}
            </Badge>
          ))}
        </ul>
      </LoadingSkeleton>
    </article>
  );
};
export default PokedexEntry;
