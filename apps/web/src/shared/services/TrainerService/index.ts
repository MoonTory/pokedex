import { fetchUrl, postUrl, putUrl } from "@/lib/axios";

const BASE_URL = "http://localhost:8080/";

export type Trainer = {
  id: number;
  name: string;
};

export type PokemonRecord = {
  trainerId: number;
  pokemonId: number;
  encountered: boolean;
  caught: boolean;
};

export async function getTrainers() {
  const trainers = await fetchUrl<Trainer[]>(`${BASE_URL}trainers`);
  return trainers;
}

export async function addTrainer(name: string) {
  const newTrainer = await postUrl<Trainer>(
    `${BASE_URL}trainers`,
    JSON.stringify({ name }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return newTrainer;
}

export async function getTrainerById(id: number) {
  const trainer = await fetchUrl<Trainer>(`${BASE_URL}trainers/${id}`);
  return trainer;
}

export async function getPokemonRecordsByTrainerId(
  trainerId: number
): Promise<PokemonRecord[]> {
  const records = await fetchUrl<PokemonRecord[]>(
    `${BASE_URL}trainers/${trainerId}/pokemons`
  );
  return records;
}

export async function addPokemonRecord(
  trainerId: number,
  pokemonId: number,
  encountered: boolean,
  caught: boolean
) {
  const newRecord = await postUrl<PokemonRecord>(
    `${BASE_URL}trainers/${trainerId}/pokemons`,
    JSON.stringify({ pokemonId, encountered, caught }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return newRecord;
}

export async function updatePokemonRecord(
  trainerId: number,
  pokemonId: number,
  encountered?: boolean,
  caught?: boolean
) {
  const record = await putUrl<PokemonRecord>(
    `${BASE_URL}trainers/${trainerId}/pokemons/${pokemonId}`,
    JSON.stringify({ encountered, caught }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return record;
}
