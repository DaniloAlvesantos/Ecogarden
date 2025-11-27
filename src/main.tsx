import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthInitializer } from "./contexts/auth";
import { AppRoutes } from "./routes/routes.tsx";
import "./index.scss";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <AppRoutes />
      </AuthInitializer>
    </QueryClientProvider>
  </BrowserRouter>
);
