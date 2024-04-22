import { fetchUrl, postUrl, putUrl } from "@/lib/axios";

const BASE_URL = "http://localhost:8080/";

export type Trainer = {
  id: string;
  name: string;
};

export type PokemonRecord = {
  trainerId: string;
  pokemonId: string;
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

export async function getTrainerById(id: string | number) {
  try {
    const trainer = await fetchUrl<Trainer>(`${BASE_URL}trainers/${id}`);
    return trainer;
  } catch (error) {
    return undefined;
  }
}

export async function getTrainerByName(trainerName: string) {
  // return undefined if not found
  const trainer = await fetchUrl<Trainer>(
    `${BASE_URL}trainers?name=${trainerName}`
  );

  if (!trainer) {
    return undefined;
  }

  return trainer;
}

export async function getPokemonRecordsByTrainerId(
  trainerId: string
): Promise<PokemonRecord[]> {
  const records = await fetchUrl<PokemonRecord[]>(
    `${BASE_URL}trainers/${trainerId}/pokemons`
  );
  return records;
}

export async function addPokemonRecord(
  trainerId: string,
  pokemonId: string,
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
  trainerId: string,
  pokemonId: string,
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
