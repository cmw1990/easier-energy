
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { mainRoutes } from "@/routes/mainRoutes";
import { toolRoutes } from "@/routes/toolRoutes";
import { gameRoutes } from "@/routes/gameRoutes";

const queryClient = new QueryClient();

// Convert route configs to RouteObject array
const routes: RouteObject[] = [mainRoutes, toolRoutes, gameRoutes];

const router = createBrowserRouter(routes);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
