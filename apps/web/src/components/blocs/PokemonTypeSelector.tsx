import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

import { useToast } from "@/hooks/use-toast";
import { POKEMON_TYPES } from "@/contants/pokemon-types";

export function mapPokemonTypesToOptions(types: any[]): Option[] {
  return types.map((type) => ({
    label: type.name,
    value: type.name,
    color: type.color,
  }));
}

export const PokemonTypeSelector: React.FC<{
  value: any[];
  onChange: (types: any[]) => void;
}> = ({ value, onChange }) => {
  const { toast } = useToast();
  return (
    <div className="w-full">
      <MultipleSelector
        className="w-full"
        maxSelected={2}
        onMaxSelected={(maxLimit) => {
          toast({
            title: `You have reached max selected: ${maxLimit}`,
          });
        }}
        value={value}
        onChange={(options) =>
          onChange(
            options.map((o) => POKEMON_TYPES.find((t) => t.name === o.value))
          )
        }
        defaultOptions={mapPokemonTypesToOptions(POKEMON_TYPES)}
        placeholder="Select a pokemon type..."
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  );
};
