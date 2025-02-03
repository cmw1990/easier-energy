import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brain } from "lucide-react";

type GameType = 'chess' | 'go' | 'checkers' | 'reversi' | 'xiangqi' | 'shogi' | 'gomoku' | 'connect_four' | 'tic_tac_toe';
type GameStatus = 'in_progress' | 'completed';

interface GameState {
  board: string[][];
  currentPlayer: 'black' | 'white';
  captures: {
    black: number;
    white: number;
  };
  status: GameStatus;
  winner: string | null;
}

interface BoardGame {
  game_type: GameType;
  difficulty_level: number;
  game_state: {
    board: string[][];
    currentPlayer: 'black' | 'white';
    captures: {
      black: number;
      white: number;
    };
  };
  status: GameStatus;
  user_id: string | undefined;
}

const BOARD_SIZE = 19;

const GoGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill('')),
    currentPlayer: 'black',
    captures: { black: 0, white: 0 },
    status: 'in_progress',
    winner: null
  });
  const [difficulty, setDifficulty] = useState('1');
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingGame();
  }, []);

  const loadExistingGame = async () => {
    try {
      const { data: existingGame } = await supabase
        .from('board_games')
        .select('*')
        .eq('game_type', 'go')
        .eq('status', 'in_progress')
        .maybeSingle();

      if (existingGame) {
        const gameState = existingGame.game_state as GameState;
        setGameState(gameState);
        setDifficulty(existingGame.difficulty_level.toString());
      }
    } catch (error) {
      console.error('Error loading game:', error);
      toast({
        title: "Error Loading Game",
        description: "There was a problem loading your game.",
        variant: "destructive",
      });
    }
  };

  const createNewGame = async () => {
    const user = await supabase.auth.getUser();
    const newGame: BoardGame = {
      game_type: 'go',
      difficulty_level: parseInt(difficulty),
      game_state: {
        board: Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill('')),
        currentPlayer: 'black',
        captures: { black: 0, white: 0 }
      },
      status: 'in_progress',
      user_id: user.data.user?.id,
    };

    try {
      const { error } = await supabase
        .from('board_games')
        .insert([newGame]);

      if (error) throw error;

      setGameState({
        ...newGame.game_state,
        status: 'in_progress',
        winner: null
      });

      toast({
        title: "New Game Started",
        description: "Good luck!",
      });
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error Creating Game",
        description: "There was a problem starting a new game.",
        variant: "destructive",
      });
    }
  };

  const makeMove = async (row: number, col: number) => {
    if (isThinking || gameState.status === 'completed') return;

    try {
      const newBoard = gameState.board.map(row => [...row]);
      newBoard[row][col] = gameState.currentPlayer;

      const newGameState = {
        ...gameState,
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black'
      };

      setGameState(newGameState);

      // Update game in database
      const { error } = await supabase
        .from('board_games')
        .update({
          game_state: newGameState,
          updated_at: new Date().toISOString()
        })
        .eq('game_type', 'go')
        .eq('status', 'in_progress');

      if (error) throw error;

      // AI move simulation
      if (newGameState.currentPlayer === 'white') {
        setIsThinking(true);
        setTimeout(() => {
          // Simple AI: random valid move
          const validMoves = [];
          for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
              if (!newBoard[i][j]) {
                validMoves.push([i, j]);
              }
            }
          }
          if (validMoves.length > 0) {
            const [aiRow, aiCol] = validMoves[Math.floor(Math.random() * validMoves.length)];
            makeMove(aiRow, aiCol);
          }
          setIsThinking(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error making move:', error);
      toast({
        title: "Error Making Move",
        description: "There was a problem making your move.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Go Game</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="difficulty">Difficulty:</Label>
            <Input
              id="difficulty"
              type="number"
              min="1"
              max="10"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-20"
              disabled={gameState.status === 'in_progress'}
            />
          </div>
          <Button onClick={createNewGame} disabled={isThinking}>
            New Game
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-19 gap-0.5 bg-yellow-100 p-4 rounded-lg">
        {gameState.board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="outline"
              className={`w-8 h-8 p-0 ${
                cell === 'black' ? 'bg-black' : 
                cell === 'white' ? 'bg-white' : 
                'bg-yellow-200'
              }`}
              onClick={() => makeMove(rowIndex, colIndex)}
              disabled={!!cell || isThinking || gameState.status === 'completed'}
            />
          ))
        ))}
      </div>

      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <div>Black Captures: {gameState.captures.black}</div>
        <div>White Captures: {gameState.captures.white}</div>
      </div>
    </Card>
  );
};

export default GoGame;