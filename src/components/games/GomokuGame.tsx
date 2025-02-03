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
import type { Json } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type GameType = 'chess' | 'go' | 'checkers' | 'reversi' | 'xiangqi' | 'shogi' | 'gomoku' | 'connect_four' | 'tic_tac_toe';
type GameStatus = 'in_progress' | 'completed';

interface GameState {
  board: Array<Array<string>>;
  currentPlayer: 'black' | 'white';
  status: GameStatus;
  winner: string | null;
}

const BOARD_SIZE = 15; // Traditional Gomoku is played on a 15x15 board
const WIN_LENGTH = 5; // Need 5 in a row to win

const GomokuGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('')),
    currentPlayer: 'black',
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
        .eq('game_type', 'gomoku')
        .eq('status', 'in_progress')
        .maybeSingle();

      if (existingGame) {
        const loadedGameState = existingGame.game_state as unknown as GameState;
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
    const initialGameState: GameState = {
      board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('')),
      currentPlayer: 'black',
      status: 'in_progress',
      winner: null
    };

    try {
      const { error } = await supabase
        .from('board_games')
        .insert([{
          game_type: 'gomoku' as GameType,
          difficulty_level: parseInt(difficulty),
          game_state: initialGameState as unknown as Json,
          status: 'in_progress',
          user_id: user.data.user?.id,
        }]);
      
      if (error) throw error;
      
      setGameState(initialGameState);
    } catch (error) {
      console.error('Error creating new game:', error);
      toast({
        title: 'Error',
        description: 'Failed to create a new game. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const checkWin = (row: number, col: number, board: string[][]): boolean => {
    const directions = [
      [1, 0],   // horizontal
      [0, 1],   // vertical
      [1, 1],   // diagonal right
      [1, -1],  // diagonal left
    ];
    
    const color = board[row][col];
    
    for (const [dx, dy] of directions) {
      let count = 1;
      
      // Check in positive direction
      for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (
          newRow < 0 || newRow >= BOARD_SIZE || 
          newCol < 0 || newCol >= BOARD_SIZE ||
          board[newRow][newCol] !== color
        ) break;
        count++;
      }
      
      // Check in negative direction
      for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (
          newRow < 0 || newRow >= BOARD_SIZE || 
          newCol < 0 || newCol >= BOARD_SIZE ||
          board[newRow][newCol] !== color
        ) break;
        count++;
      }
      
      if (count >= WIN_LENGTH) return true;
    }
    
    return false;
  };

  const makeMove = async (row: number, col: number) => {
    if (gameState.board[row][col] !== '' || gameState.status === 'completed') {
      return;
    }

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = gameState.currentPlayer;
    
    const hasWon = checkWin(row, col, newBoard);
    
    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
      status: hasWon ? 'completed' : 'in_progress',
      winner: hasWon ? gameState.currentPlayer : null
    };

    setGameState(newGameState);

    try {
      const { error } = await supabase
        .from('board_games')
        .update({
          game_state: newGameState as unknown as Json,
          status: newGameState.status,
          winner: newGameState.winner,
          last_move_at: new Date().toISOString(),
        })
        .eq('game_type', 'gomoku')
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
        <div className="grid grid-cols-15 grid-rows-15 absolute inset-0">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "border border-black relative",
                  cell === 'black' && "bg-black rounded-full",
                  cell === 'white' && "bg-white rounded-full border-2"
                )}
                onClick={() => makeMove(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
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

export default GomokuGame;