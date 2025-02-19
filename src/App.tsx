
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { mainRoutes } from "@/routes/mainRoutes";
import { toolRoutes } from "@/routes/toolRoutes";
import { gameRoutes } from "@/routes/gameRoutes";

const queryClient = new QueryClient();

// Combine all routes
const router = createBrowserRouter([
  {
    path: "/",
    children: [...mainRoutes, ...toolRoutes, ...gameRoutes]
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
