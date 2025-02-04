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
import ChessGame from "@/components/games/ChessGame";
import GoGame from "@/components/games/GoGame";
import { ReversiGame } from "@/components/games/ReversiGame";
import { ConnectFourGame } from "@/components/games/ConnectFourGame";
import { TicTacToeGame } from "@/components/games/TicTacToeGame";
import { XiangqiGame } from "@/components/games/XiangqiGame";
import { ShogiGame } from "@/components/games/ShogiGame";
import { CheckersGame } from "@/components/games/CheckersGame";
import GomokuGame from "@/components/games/GomokuGame";
import ZenDrift from "@/components/games/ZenDrift";
import Sobriety from "@/pages/Sobriety";
import SubstanceLog from "@/pages/SubstanceLog";
import QuitPlan from "@/pages/QuitPlan";
import Recovery from "@/pages/Recovery";
import Support from "@/pages/Support";

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
              <Route path="/relax" element={<Relax />} />
              <Route path="/focus" element={<Focus />} />
              <Route path="/breathing" element={<Breathing />} />
              <Route path="/meditation" element={<Meditation />} />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/caffeine" element={<Caffeine />} />
              <Route path="/nicotine" element={<Nicotine />} />
              <Route path="/supplements" element={<Supplements />} />
              <Route path="/food" element={<Food />} />
              <Route path="/distraction-blocker" element={<DistractionBlocker />} />
              <Route path="/sobriety" element={<Sobriety />} />
              <Route path="/sobriety/log" element={<SubstanceLog />} />
              <Route path="/sobriety/quit-plan" element={<QuitPlan />} />
              <Route path="/sobriety/recovery" element={<Recovery />} />
              <Route path="/sobriety/support" element={<Support />} />
              <Route path="/games/chess" element={<ChessGame />} />
              <Route path="/games/go" element={<GoGame />} />
              <Route path="/games/reversi" element={<ReversiGame />} />
              <Route path="/games/connect-four" element={<ConnectFourGame />} />
              <Route path="/games/tic-tac-toe" element={<TicTacToeGame />} />
              <Route path="/games/xiangqi" element={<XiangqiGame />} />
              <Route path="/games/shogi" element={<ShogiGame />} />
              <Route path="/games/checkers" element={<CheckersGame />} />
              <Route path="/games/gomoku" element={<GomokuGame />} />
              <Route path="/games/zen-drift" element={<ZenDrift />} />
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