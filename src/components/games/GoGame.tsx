import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brain } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type GameType = 'chess' | 'go' | 'checkers' | 'reversi' | 'xiangqi' | 'shogi' | 'gomoku' | 'connect_four' | 'tic_tac_toe';
type GameStatus = 'in_progress' | 'completed';

interface GameState {
  board: Array<Array<string>>;
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
  game_state: GameState;
  status: GameStatus;
  user_id: string | undefined;
}

const BOARD_SIZE = 19;

const GoGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('')),
    currentPlayer: 'black',
    captures: { black: 0, white: 0 },
    status: 'in_progress',
    winner: null
  });
  
  const [difficulty, setDifficulty] = useState('1');
  const { toast } = useToast();

  useEffect(() => {
    loadOrCreateGame();
  }, []);

  const loadOrCreateGame = async () => {
    try {
      const { data: existingGame, error } = await supabase
        .from('board_games')
        .select('*')
        .eq('game_type', 'go')
        .eq('status', 'in_progress')
        .maybeSingle();

      if (existingGame) {
        const loadedGameState = existingGame.game_state as GameState;
        setGameState(loadedGameState);
        setDifficulty(existingGame.difficulty_level.toString());
      } else {
        await createNewGame();
      }
    } catch (error) {
      console.error('Error loading game:', error);
      toast({
        title: 'Error',
        description: 'Failed to load the game. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const createNewGame = async () => {
    const user = await supabase.auth.getUser();
    const newGame: BoardGame = {
      game_type: 'go',
      difficulty_level: parseInt(difficulty),
      game_state: {
        board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('')),
        currentPlayer: 'black',
        captures: { black: 0, white: 0 },
        status: 'in_progress',
        winner: null
      },
      status: 'in_progress',
      user_id: user.data.user?.id,
    };

    try {
      const { error } = await supabase
        .from('board_games')
        .insert([newGame]);
      
      if (error) throw error;
      
      setGameState(newGame.game_state);
    } catch (error) {
      console.error('Error creating new game:', error);
      toast({
        title: 'Error',
        description: 'Failed to create a new game. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const makeMove = async (row: number, col: number) => {
    if (gameState.board[row][col] !== '' || gameState.status === 'completed') {
      return;
    }

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = gameState.currentPlayer;

    const newGameState: GameState = {
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
    };

    setGameState(newGameState);

    try {
      const { error } = await supabase
        .from('board_games')
        .update({
          game_state: newGameState,
          last_move_at: new Date().toISOString(),
        })
        .eq('game_type', 'go')
        .eq('status', 'in_progress');

      if (error) throw error;
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the game. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6 w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Select
          value={difficulty}
          onValueChange={(value) => setDifficulty(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Easy</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="3">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={createNewGame}>
          New Game
        </Button>
      </div>
      <div className="aspect-square w-full bg-yellow-100 relative">
        <div className="grid grid-cols-19 grid-rows-19 absolute inset-0">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "border border-black relative",
                  cell === 'black' && "bg-black rounded-full",
                  cell === 'white' && "bg-white rounded-full"
                )}
                onClick={() => makeMove(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>Black Captures: {gameState.captures.black}</div>
        <div>White Captures: {gameState.captures.white}</div>
      </div>
      {gameState.status === 'completed' && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">
            {gameState.winner ? `${gameState.winner} wins!` : 'Game ended in a draw!'}
          </h3>
        </div>
      )}
    </Card>
  );
};

export default GoGame;