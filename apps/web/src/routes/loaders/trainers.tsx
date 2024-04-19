import { LoaderFunctionArgs } from "react-router";
import { QueryClient } from "@tanstack/react-query";

import { pokedexLoader, PokedexLoaderReturnType } from "./pokedex";

import { combineLoaders } from "@/lib/router";
import {
  getPokemonRecordsByTrainerId,
  getTrainers,
} from "@/shared/services/TrainerService";

export const trainerListQuery = (q: string | null) => ({
  queryKey: ["trainers", "list", q ?? "all"],
  queryFn: async () => getTrainers(),
});

export const trainerCollectionQuery = (trainerId: number) => ({
  reftchInterval: 1000 * 60 * 5,
  queryKey: ["trainers", "collection", trainerId],
  queryFn: async () => getPokemonRecordsByTrainerId(trainerId),
});

export type TrainersLoaderReturnType = Awaited<
  ReturnType<ReturnType<typeof trainersLoader>>
>;

export const trainersLoader =
  (queryClient: QueryClient) => async (_args: LoaderFunctionArgs) => {
    const query = trainerListQuery("");

    const trainers = await queryClient.ensureQueryData(query);

    return { trainers };
  };

export type TrainerCollectionLoaderReturnType = Awaited<
  ReturnType<ReturnType<typeof trainerCollectionLoader>>
>;

export const trainerCollectionLoader =
  (queryClient: QueryClient) => async (args: LoaderFunctionArgs) => {
    const { trainerId } = args.params as { trainerId: string };

    if (isNaN(parseInt(trainerId))) {
      throw new Error("Invalid trainer id");
    }

    const query = trainerCollectionQuery(parseInt(trainerId));

    const collection = await queryClient.ensureQueryData({
      ...query,
      staleTime: 1000 * 60 * 5,
    });

    return { collection };
  };

type TrainersPageLoaderReturnType = TrainerCollectionLoaderReturnType &
  PokedexLoaderReturnType;

export const trainersPageLoader = (queryClient: QueryClient) =>
  combineLoaders<TrainersPageLoaderReturnType>(queryClient, [
    trainerCollectionLoader,
    pokedexLoader,
  ]);
