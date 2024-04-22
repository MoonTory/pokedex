import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Router } from "@/routes";

import { Toaster } from "./context/toast.context";
import { AuthProvider, ThemeProvider, PokemonProvider } from "@/context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <PokemonProvider>
          <Router />
        </PokemonProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
