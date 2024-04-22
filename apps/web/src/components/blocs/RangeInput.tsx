import { Input, Label } from "@/components/ui";

export const RangeInput = () => {
  return (
    <div className="flex items-center w-full">
      <Label htmlFor="height">Height</Label>
      <div className="flex items-center justify-end pl-2">
        <Input id="height" defaultValue="25px" className="mr-2 h-8" />
        <Label htmlFor="height">To</Label>
        <Input id="height" defaultValue="25px" className="ml-2 h-8" />
      </div>
    </div>
  );
};
