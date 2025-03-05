import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();
import { BrowserRouter as Router } from "react-router";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client }>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </StrictMode>
);
