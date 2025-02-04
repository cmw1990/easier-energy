import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import NotFound from "@/components/NotFound";
import DualNBackGame from "@/components/games/dual-n-back/DualNBackGame";
import ChessGame from "@/components/games/chess/ChessGame";
import GoGame from "@/components/games/go/GoGame";
import CheckersGame from "@/components/games/checkers/CheckersGame";
import ReversiGame from "@/components/games/reversi/ReversiGame";
import XiangqiGame from "@/components/games/xiangqi/XiangqiGame";
import ShogiGame from "@/components/games/shogi/ShogiGame";
import GomokuGame from "@/components/games/gomoku/GomokuGame";
import ConnectFourGame from "@/components/games/connect-four/ConnectFourGame";
import TicTacToeGame from "@/components/games/tic-tac-toe/TicTacToeGame";
import PatternRecognitionGame from "@/components/games/pattern-recognition/PatternRecognitionGame";
import BrainMatchGame from "@/components/games/brain-match/BrainMatchGame";
import NBackGame from "@/components/games/n-back/NBackGame";
import StroopTestGame from "@/components/games/stroop-test/StroopTestGame";
import DigitSpanGame from "@/components/games/digit-span/DigitSpanGame";
import MentalRotationGame from "@/components/games/mental-rotation/MentalRotationGame";
import WordPairsGame from "@/components/games/word-pairs/WordPairsGame";
import SpeedTypingGame from "@/components/games/speed-typing/SpeedTypingGame";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/games/chess" element={<ChessGame />} />
              <Route path="/games/go" element={<GoGame />} />
              <Route path="/games/checkers" element={<CheckersGame />} />
              <Route path="/games/reversi" element={<ReversiGame />} />
              <Route path="/games/xiangqi" element={<XiangqiGame />} />
              <Route path="/games/shogi" element={<ShogiGame />} />
              <Route path="/games/gomoku" element={<GomokuGame />} />
              <Route path="/games/connect-four" element={<ConnectFourGame />} />
              <Route path="/games/tic-tac-toe" element={<TicTacToeGame />} />
              <Route path="/games/pattern-recognition" element={<PatternRecognitionGame />} />
              <Route path="/games/brain-match" element={<BrainMatchGame />} />
              <Route path="/games/n-back" element={<NBackGame />} />
              <Route path="/games/stroop-test" element={<StroopTestGame />} />
              <Route path="/games/digit-span" element={<DigitSpanGame />} />
              <Route path="/games/mental-rotation" element={<MentalRotationGame />} />
              <Route path="/games/word-pairs" element={<WordPairsGame />} />
              <Route path="/games/speed-typing" element={<SpeedTypingGame />} />
              <Route path="/games/dual-n-back" element={<DualNBackGame />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
