import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/AuthProvider"

import Layout from "@/components/layout/Layout"
import NotFound from "@/components/layout/NotFound"
import Index from "@/pages/Index"
import CBTPage from "@/pages/CBT"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/cbt",
        element: <CBTPage />,
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App