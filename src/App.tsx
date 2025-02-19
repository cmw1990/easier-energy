
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { mainRoutes } from "@/routes/mainRoutes";
import { toolRoutes } from "@/routes/toolRoutes";
import { gameRoutes } from "@/routes/gameRoutes";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

// Combine all routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes[0].children, ...toolRoutes, ...gameRoutes]
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
