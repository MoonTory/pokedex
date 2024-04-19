import { useDebounce } from "rooks";
import { Outlet } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import { CircleUser, Package2, Search, Menu } from "lucide-react";

import {
  Input,
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui";
import { ThemeToggle } from "@/components/blocs";

export const RootLayout: React.FC<React.PropsWithChildren> = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    search: "",
  });

  const search = searchParams.get("search");

  const debouncedSubmit = useDebounce((e) => {
    setSearchParams({ search: e.search.value });
  }, 100);

  return (
    <section className="bg-[#F6F8FC] dark:bg-muted/40 h-screen font-outfit overflow-y-auto bg-[url(/pokeball-icon.png)] dark:bg-none bg-no-repeat bg-[110%_-20%] overflow-x-hidden">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Pokedex</span>
          </Link>
          <Link
            to="/"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Pokedex
          </Link>
          <Link
            to="/trainer/1"
            className="text-muted-foreground transition-colors hover:text-foreground text-center"
          >
            Trainer Collection
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Pokedex</span>
              </Link>
              <Link to="/" className="hover:text-foreground">
                Pokedex
              </Link>
              <Link
                to="/trainer/1"
                className="text-muted-foreground hover:text-foreground"
              >
                Collection
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form
            className="ml-auto flex-1 sm:flex-initial"
            id="search-form"
            role="search"
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                defaultValue={search as any}
                id="search"
                aria-label="Search pokemons"
                type="search"
                name="search"
                key={search}
                autoFocus
                placeholder="Search pokemons..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                onChange={(ev) => {
                  debouncedSubmit(ev.currentTarget.form);
                }}
              />
            </div>
          </form>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </section>
  );
};
