import { Form } from "react-router-dom";
import { Label, Input, Button, Card, CardHeader } from "@/components/ui";

export function LoginPage() {
  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(/pokemon-background.jpg)` }}
    >
      <Card className="mx-auto grid w-[350px] gap-6 p-4">
        <CardHeader>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Pokedex App</h1>
          </div>
        </CardHeader>
        <p className="text-muted-foreground text-left text-sm">
          Enter your trainer name below to login. An account will be created on
          your first login.
        </p>
        <Form method="post" action="/login" className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Trainer Name</Label>
            <Input
              required
              type="text"
              id="trainerName"
              name="trainerName"
              placeholder="Ash Ketchum"
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
