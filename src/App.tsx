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
import Relax from "@/pages/Relax";
import Breathing from "@/pages/Breathing";
import Caffeine from "@/pages/Caffeine";
import Nicotine from "@/pages/Nicotine";
import Supplements from "@/pages/Supplements";
import DistractionBlocker from "@/pages/DistractionBlocker";
import Food from "@/pages/Food";
import Meditation from "@/pages/Meditation";
import Exercise from "@/pages/Exercise";
import NotFound from "@/pages/NotFound";
import EyeExercises from "@/pages/EyeExercises";
import Motivation from "@/pages/Motivation";
import LogicPuzzles from "@/components/games/LogicPuzzles";
import Sudoku from "@/components/games/Sudoku";
import BrainMatch3 from "@/components/games/BrainMatch3";
import NumberMemoryGame from "@/components/games/number-memory/NumberMemoryGame";
import { PatternRecognitionGame } from "@/components/games/pattern-recognition/PatternRecognitionGame";

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
              <Route path="/motivation" element={<Motivation />} />
              <Route path="/sleep" element={<Sleep />} />
              <Route path="/sleep/track" element={<SleepTrack />} />
              <Route path="/relax" element={<Relax />} />
              <Route path="/focus" element={<Focus />} />
              <Route path="/breathing" element={<Breathing />} />
              <Route path="/meditation" element={<Meditation />} />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/eye-exercises" element={<EyeExercises />} />
              <Route path="/caffeine" element={<Caffeine />} />
              <Route path="/nicotine" element={<Nicotine />} />
              <Route path="/supplements" element={<Supplements />} />
              <Route path="/food" element={<Food />} />
              <Route path="/distraction-blocker" element={<DistractionBlocker />} />
              <Route path="/games/logic-puzzles" element={<LogicPuzzles />} />
              <Route path="/games/sudoku" element={<Sudoku />} />
              <Route path="/games/brain-match-3" element={<BrainMatch3 />} />
              <Route path="/games/number-memory" element={<NumberMemoryGame />} />
              <Route path="/games/pattern-recognition" element={<PatternRecognitionGame />} />
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