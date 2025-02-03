import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { CheckersState, GameStatus, GameType, Player } from '@/types/boardGames';
import type { Json } from '@/integrations/supabase/types';

const BOARD_SIZE = 8;

export const CheckersGame = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<CheckersState | null>(null);
  const [difficulty, setDifficulty] = useState('1');

  const initializeBoard = (): number[][] => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    
    // Set up black pieces (1)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if ((i + j) % 2 === 1) {
          board[i][j] = 1;
        }
      }
    }
    
    // Set up white pieces (2)
    for (let i = BOARD_SIZE - 3; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if ((i + j) % 2 === 1) {
          board[i][j] = 2;
        }
      }
    }
    
    return board;
  };

  const startNewGame = async () => {
    const initialGameState: CheckersState = {
      board: initializeBoard(),
      currentPlayer: 'black',
      captures: {
        black: 0,
        white: 0
      },
      kings: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)),
      status: 'in_progress',
      winner: null
    };

    try {
      const { error } = await supabase
        .from('board_games')
        .insert([{
          game_type: 'checkers' as GameType,
          difficulty_level: parseInt(difficulty),
          game_state: initialGameState as unknown as Json,
          status: 'in_progress' as GameStatus,
          user_id: user.data.user?.id,
        }]);
      
      if (error) throw error;
      
      setGameState(initialGameState);
      toast({
        title: "New game started",
        description: "Good luck!",
      });
    } catch (error) {
      console.error('Error starting new game:', error);
      toast({
        title: "Error",
        description: "Failed to start new game",
        variant: "destructive",
      });
    }
  };

  const makeMove = async (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (!gameState || gameState.status !== 'in_progress') return;

    // Implement move validation and game logic here
    const newGameState = { ...gameState };
    
    try {
      const { error } = await supabase
        .from('board_games')
        .update({
          game_state: newGameState as unknown as Json,
          last_move_at: new Date().toISOString(),
        })
        .eq('user_id', user.data.user?.id)
        .eq('status', 'in_progress')
        .eq('game_type', 'checkers');

      if (error) throw error;
      
      setGameState(newGameState);
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        title: "Error",
        description: "Failed to update game",
        variant: "destructive",
      });
    }
  };

  const renderBoard = () => {
    if (!gameState) return null;

    return (
      <div className="grid grid-cols-8 gap-0.5 bg-gray-700 p-0.5">
        {gameState.board.map((row, i) => 
          row.map((cell, j) => (
            <div 
              key={`${i}-${j}`}
              className={`w-12 h-12 flex items-center justify-center
                ${(i + j) % 2 === 0 ? 'bg-amber-200' : 'bg-amber-800'}`}
            >
              {cell > 0 && (
                <div 
                  className={`w-8 h-8 rounded-full 
                    ${cell === 1 ? 'bg-black' : 'bg-white border-2 border-gray-300'}
                    ${gameState.kings[i][j] ? 'ring-2 ring-yellow-400' : ''}`}
                />
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Easy</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={startNewGame}>New Game</Button>
        </div>

        {gameState ? (
          <div className="space-y-4">
            {renderBoard()}
            <div className="flex justify-between text-sm">
              <div>Black captures: {gameState.captures.black}</div>
              <div>White captures: {gameState.captures.white}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Start a new game to begin playing
          </div>
        )}
      </div>
    </Card>
  );
};