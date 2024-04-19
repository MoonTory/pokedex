import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Router } from "@/routes";

import { ThemeProvider } from "@/context/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router />
    </ThemeProvider>
  </React.StrictMode>
);
