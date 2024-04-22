import { useState } from "react";
import { Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Input,
  Label,
  Separator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import {
  PokemonTypeSelector,
  mapPokemonTypesToOptions,
} from "./PokemonTypeSelector";
import { usePokemon } from "@/context";

export const FilterMenu = () => {
  const { selectedTypes } = usePokemon();
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState({
    minHeight: "",
    maxHeight: "",
    minWeight: "",
    maxWeight: "",
  });

  const [error, setError] = useState("");

  const handleTypeChange = (types: any) => {
    setSearchParams((prev) => {
      prev.set("types", types.map((t: any) => t.name).join(","));
      return prev;
    });
  };

  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validateAndSetParams = () => {
    const { minHeight, maxHeight, minWeight, maxWeight } = values;
    let valid = true;

    // Validate that if a min is entered, a corresponding max must also be entered
    if (minHeight && !maxHeight) {
      setError("Please enter a maximum height.");
      valid = false;
    } else if (!minHeight && maxHeight) {
      setError("Please enter a minimum height.");
      valid = false;
    } else if (minWeight && !maxWeight) {
      setError("Please enter a maximum weight.");
      valid = false;
    } else if (!minWeight && maxWeight) {
      setError("Please enter a minimum weight.");
      valid = false;
    } else if (parseInt(minHeight) > parseInt(maxHeight)) {
      setError("Minimum height cannot exceed maximum height.");
      valid = false;
    } else if (parseInt(minWeight) > parseInt(maxWeight)) {
      setError("Minimum weight cannot exceed maximum weight.");
      valid = false;
    } else {
      setError(""); // Clear any existing errors if all validations are passed
    }

    if (valid) {
      setSearchParams((prev) => {
        minHeight === ""
          ? prev.delete("minHeight")
          : prev.set("minHeight", minHeight);
        maxHeight === ""
          ? prev.delete("maxHeight")
          : prev.set("maxHeight", maxHeight);
        minWeight === ""
          ? prev.delete("minWeight")
          : prev.set("minWeight", minWeight);
        maxWeight === ""
          ? prev.delete("maxWeight")
          : prev.set("maxWeight", maxWeight);

        return prev;
      });
    }
  };

  const handleClear = () => {
    setValues({
      minHeight: "",
      maxHeight: "",
      minWeight: "",
      maxWeight: "",
    });
    setError("");
    setSearchParams({});
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
          <Filter className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all" />
          <span className="sr-only">Toggle filters</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set filters for the pokemon list.
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              <Label htmlFor="types" className="pb-4">
                Types
              </Label>
              <PokemonTypeSelector
                value={mapPokemonTypesToOptions(selectedTypes)}
                onChange={handleTypeChange}
              />
            </div>

            {/* Height Inputs */}
            <div className="flex items-center gap-2 pt-2">
              <Label htmlFor="minHeight">Height</Label>
              <Input
                type="number"
                value={values.minHeight}
                onChange={(e) => handleChange("minHeight", e.target.value)}
                className="mr-2 h-8"
              />
              <Label htmlFor="maxHeight">To</Label>
              <Input
                type="number"
                value={values.maxHeight}
                onChange={(e) => handleChange("maxHeight", e.target.value)}
                className="ml-2 h-8"
              />
            </div>

            {/* Weight Inputs */}
            <div className="flex items-center gap-2">
              <Label htmlFor="minWeight">Weight</Label>
              <Input
                type="number"
                value={values.minWeight}
                onChange={(e) => handleChange("minWeight", e.target.value)}
                className="mr-2 h-8"
              />
              <Label htmlFor="maxWeight">To</Label>
              <Input
                type="number"
                value={values.maxWeight}
                onChange={(e) => handleChange("maxWeight", e.target.value)}
                className="ml-2 h-8"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
              <Button onClick={validateAndSetParams}>Apply</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
