import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Sleep from "@/pages/Sleep";
import SleepTrack from "@/pages/SleepTrack";
import Focus from "@/pages/Focus";
import Breathing from "@/pages/Breathing";
import Caffeine from "@/pages/Caffeine";
import DistractionBlocker from "@/pages/DistractionBlocker";
import Food from "@/pages/Food";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sleep" element={<Sleep />} />
              <Route path="/sleep/track" element={<SleepTrack />} />
              <Route path="/focus" element={<Focus />} />
              <Route path="/breathing" element={<Breathing />} />
              <Route path="/caffeine" element={<Caffeine />} />
              <Route path="/food" element={<Food />} />
              <Route path="/distraction-blocker" element={<DistractionBlocker />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;