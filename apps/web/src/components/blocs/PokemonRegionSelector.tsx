import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { POKEMON_REGIONS } from "@/contants/pokemon-regions";

function mapPokemonRegionsToOptions(regions: any[]) {
  return regions.map((region) => ({
    value: region.name,
    label: region.name,
  }));
}

export const PokemonRegionComboBox: React.FC<{
  value: string;
  onChange: (value: any) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);

  const regions = mapPokemonRegionsToOptions(POKEMON_REGIONS);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? regions.find((region) => region.value === value)?.label
            : "Select region..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search region..." />
          <CommandEmpty>No region found.</CommandEmpty>
          <CommandGroup>
            {regions.map((region) => (
              <CommandItem
                key={region.value}
                value={region.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === region.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {region.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
