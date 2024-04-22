import "react-svg-radar-chart/build/css/index.css";

import React from "react";
import RadarChart from "react-svg-radar-chart";
import { useQuery } from "@tanstack/react-query";

import {
  colorByStat,
  colorByType,
  formatStatName,
} from "@/contants/pokemon-color";
import { useAuth } from "@/context";
import { PokemonStat } from "@/shared/types/pokemon";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { trainerCollectionQuery } from "@/routes/loaders/trainers.loader";
import { PokemonEvolutions } from "@/components/blocs/PokemonEvolutions";
import {
  Card,
  CardContent,
  CardHeader,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@/components/ui";
import { EllipsisVertical } from "lucide-react";
import { stopPropagation } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TrainerService } from "@/shared/services";

const PokemonEntryDetails = ({ pokemon, evolutions }: any) => {
  const {
    state: { user },
  } = useAuth();
  const { toast } = useToast();
  const [showShiny, setShowShiny] = useLocalStorage<boolean>(
    `shiny_${pokemon.name}`,
    false
  );

  const [isHovered, setIsHovered] = React.useState(false);

  const { data: collection, refetch } = useQuery({
    ...trainerCollectionQuery(user?.id ?? "1"),
    refetchInterval: 1000 * 60 * 5,
  });

  const toggleHover = () => setIsHovered(!isHovered);

  const findInCollection = (pokemonId?: string) =>
    collection?.find((c) => c.pokemonId === pokemonId);

  const [isCaught, setIsCaught] = React.useState(
    findInCollection(pokemon?.id)?.caught
  );

  const [isEncountered, setIsEncountered] = React.useState(
    findInCollection(pokemon?.id)?.encountered
  );

  const renderShinySprite = (pokemon: any) =>
    pokemon?.sprites.versions["generation-v"]["black-white"].front_shiny;

  React.useEffect(() => {
    setIsCaught(findInCollection(pokemon?.id)?.caught);
    setIsEncountered(findInCollection(pokemon?.id)?.encountered);
  }, [collection]);

  const transformStats = (stats: PokemonStat[]) => {
    const result = {
      data: stats.reduce((acc: any, curr) => {
        const radarCategory = curr.stat.name;

        acc[radarCategory] = curr.base_stat / 255;

        return acc;
      }, {}),
      meta: {
        color: "blue",
      },
    };

    return [result];
  };

  const captions = (stats: PokemonStat[]) => {
    const caption = stats.reduce((acc: any, curr) => {
      const statName = curr.stat.name;
      const capitalized =
        statName.charAt(0).toUpperCase() + statName.slice(1).replace("-", " ");

      acc[statName] = capitalized;

      return acc;
    }, {});

    return caption;
  };

  const pokedexDescription = (pokemon: any) => {
    const blackWhiteEntries = pokemon.species.flavor_text_entries.filter(
      (entry: any) => entry.language.name === "en"
    );

    const description = blackWhiteEntries[0]?.flavor_text
      .replace(/\s+/g, " ")
      .replace(//g, " ");

    return description;
  };

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
    <Card>
      <div className="flex">
        <div className="p-2">{renderPokeballImage()}</div>
        <div className="p-2 ml-auto">
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
        </div>
      </div>
      <CardHeader>
        <header>
          <img
            className="pixelated relative left-1/2 -translate-x-1/2 -translate-y-[32%] scale-[200%]"
            src={
              showShiny
                ? renderShinySprite(pokemon)
                : pokemon?.sprites.versions["generation-v"]["black-white"]
                    .front_default
            }
            alt={`${pokemon?.name} image`}
          />
        </header>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto px-4 grid gap-2 content-start h-full hidden-scroll text-center">
          <span className="text-slate-400 text-sm font-semibold">
            N° {pokemon?.id}
          </span>
          <h2 className="font-bold text-2xl capitalize">{pokemon?.name}</h2>

          {/* Types */}
          <ul className="flex gap-2 justify-center pb-4">
            {pokemon?.types.map((type: any, idx: number) => (
              <li
                className={`p-1 rounded-md px-2 text-white text-sm capitalize ${
                  colorByType[type.type.name as keyof typeof colorByType]
                }`}
                key={idx}
              >
                {type.type.name as string}
              </li>
            ))}
          </ul>

          <Separator />

          <div className="py-4">
            <h4 className="font-bold capitalize">Pokedex Entry</h4>
            <p className="text-slate-400">{pokedexDescription(pokemon)}</p>
          </div>

          {/* Weight & Height */}
          <section className="grid grid-cols-2 gap-4 pt-4">
            <div className="grid gap-2">
              <h4 className="font-bold capitalize">Height</h4>
              <span className="bg-slate-100 dark:bg-zinc-900 block rounded-full p-1">
                {pokemon?.height / 10}m
              </span>
            </div>
            <div className="grid gap-2">
              <h4 className="font-bold capitalize">Weight</h4>
              <span className="bg-slate-100 dark:bg-zinc-900 block rounded-full p-1">
                {pokemon?.weight / 10}kg
              </span>
            </div>
          </section>

          {/* Abilities */}
          <section className="grid gap-2 py-4">
            <h4 className="font-bold capitalize">Abilities</h4>
            <ul className="grid grid-cols-2 gap-4">
              {pokemon?.abilities.map((ability: any, idx: number) => (
                <li
                  key={idx}
                  className="bg-slate-100 dark:bg-zinc-900 block rounded-full p-1 capitalize"
                >
                  <span>{ability.ability.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          {/* Stats */}
          <section className="grid gap-2 pt-4">
            <h4 className="font-bold capitalize">Base Stats</h4>
            <div className="flex justify-center">
              <RadarChart
                captions={captions(pokemon?.stats)}
                data={transformStats(pokemon?.stats)}
                size={250}
              />
            </div>
            <ul className="flex justify-center gap-3 flex-wrap py-4">
              {pokemon?.stats.map((stat: any, index: number) => (
                <li
                  className={`p-1 rounded-full dark:bg-zinc-900 ${
                    colorByStat[
                      formatStatName(stat.stat.name) as keyof typeof colorByStat
                    ]
                  }`}
                  key={index}
                >
                  <div className="bg-green-500 rounded-full w-[26px] aspect-square grid place-content-center ">
                    <span className="text-[10px] text-white font-semibold">
                      {formatStatName(stat.stat.name)}
                    </span>
                  </div>
                  <span className="font-bold  text-xs">{stat.base_stat}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          {/* Evolutions */}
          <section className="grid gap-2 pt-4">
            <h4 className="font-bold capitalize">Evolutions</h4>
            <PokemonEvolutions evolutions={evolutions ?? []} />
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonEntryDetails;
