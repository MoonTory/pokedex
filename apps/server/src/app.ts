import express from "express";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// In-memory data store
const trainers = [
  { id: 1, name: "Ash Ketchum" },
  { id: 2, name: "Misty" },
  { id: 3, name: "Brock" },
  { id: 4, name: "Tracey Sketchit" },
  { id: 5, name: "May" },
];

const pokemonRecords = [
  { trainerId: 1, pokemonId: 25, encountered: true, caught: true }, // Pikachu
  { trainerId: 1, pokemonId: 1, encountered: true, caught: false }, // Bulbasaur
  { trainerId: 2, pokemonId: 120, encountered: true, caught: true }, // Staryu
  { trainerId: 2, pokemonId: 121, encountered: true, caught: false }, // Starmie
  { trainerId: 3, pokemonId: 74, encountered: true, caught: true }, // Geodude
  { trainerId: 3, pokemonId: 95, encountered: false, caught: false }, // Onix
  { trainerId: 4, pokemonId: 123, encountered: true, caught: true }, // Scyther
  { trainerId: 5, pokemonId: 255, encountered: true, caught: true }, // Torchic
  { trainerId: 5, pokemonId: 252, encountered: false, caught: false }, // Treecko
];

app.get("/_health", (_req, res) => {
  res.send("Server is running!");
});

// Trainer endpoints
app.get("/trainers", (req, res) => {
  res.json(trainers);
});

app.post("/trainers", (req, res) => {
  const { name } = req.body;
  const newTrainer = { id: trainers.length + 1, name };
  trainers.push(newTrainer);
  res.status(201).json(newTrainer);
});

app.get("/trainers/:id", (req, res) => {
  const { id } = req.params;
  let trainer = trainers.find((t) => t.id === parseInt(id));

  if (!trainer) trainer = trainers.find((t) => t.name === id);

  if (trainer) res.json(trainer);
  else {
    res.status(404).send("Trainer not found");
  }
});

// Pokémon records endpoints
app.get("/trainers/:id/pokemons", (req, res) => {
  const { id } = req.params;
  const records = pokemonRecords.filter((pr) => pr.trainerId === parseInt(id));
  res.json(records);
});

app.post("/trainers/:id/pokemons", (req, res) => {
  const { id } = req.params;
  const { pokemonId, encountered, caught } = req.body;
  const newRecord = { trainerId: parseInt(id), pokemonId, encountered, caught };
  pokemonRecords.push(newRecord);
  res.status(201).json(newRecord);
});

app.put("/trainers/:id/pokemons/:pokemonId", (req, res) => {
  const { id, pokemonId } = req.params;
  const { encountered, caught } = req.body;

  const record = pokemonRecords.find(
    (pr) =>
      pr.trainerId === parseInt(id) && pr.pokemonId === parseInt(pokemonId)
  );

  if (record) {
    record.encountered =
      encountered !== undefined ? encountered : record.encountered;
    record.caught = caught !== undefined ? caught : record.caught;
    res.json(record);
  } else {
    res.status(404).send("Pokemon record not found");
  }
});

app.listen(PORT, () => {
  console.log(`App Listening on Port: ${PORT}`);
});
