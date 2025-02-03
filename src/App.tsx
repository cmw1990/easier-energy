import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Sleep from "./pages/Sleep";
import Breathing from "./pages/Breathing";
import Focus from "./pages/Focus";
import Caffeine from "./pages/Caffeine";
import SleepTrack from "./pages/SleepTrack";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/breathing" element={<Breathing />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/caffeine" element={<Caffeine />} />
            <Route path="/sleep-track" element={<SleepTrack />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;