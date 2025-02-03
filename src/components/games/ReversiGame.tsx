import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ReversiState, GameStatus, GameType, Player } from '@/types/boardGames';
import type { Json } from '@/integrations/supabase/types';

const BOARD_SIZE = 8;

export const ReversiGame = () => {
  const { session } = useAuth();
  const [gameState, setGameState] = useState<ReversiState | null>(null);
  const [difficulty, setDifficulty] = useState('1');

  const initializeBoard = (): number[][] => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    // Set up initial pieces
    const mid = BOARD_SIZE / 2;
    board[mid - 1][mid - 1] = 2; // White
    board[mid - 1][mid] = 1; // Black
    board[mid][mid - 1] = 1; // Black
    board[mid][mid] = 2; // White
    return board;
  };

  const startNewGame = async () => {
    const initialGameState: ReversiState = {
      board: initializeBoard(),
      currentPlayer: 'black',
      scores: {
        black: 2,
        white: 2
      },
      validMoves: getValidMoves(initializeBoard(), 'black'),
      status: 'in_progress',
      winner: null
    };

    try {
      const { error } = await supabase
        .from('board_games')
        .insert([{
          game_type: 'reversi' as GameType,
          difficulty_level: parseInt(difficulty),
          game_state: initialGameState as unknown as Json,
          status: 'in_progress' as GameStatus,
          user_id: session?.user?.id,
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

  const getValidMoves = (board: number[][], player: Player): [number, number][] => {
    const moves: [number, number][] = [];
    const playerNum = player === 'black' ? 1 : 2;
    
    // Implement valid move calculation logic here
    // This is a placeholder - actual implementation would check all directions
    
    return moves;
  };

  const makeMove = async (row: number, col: number) => {
    if (!gameState || gameState.status !== 'in_progress') return;
    
    // Validate move and update board state
    const isValidMove = gameState.validMoves.some(([r, c]) => r === row && c === col);
    if (!isValidMove) return;

    // Create new game state with the move applied
    const newGameState = { ...gameState };
    // Implement move logic here
    
    try {
      const { error } = await supabase
        .from('board_games')
        .update({
          game_state: newGameState as unknown as Json,
          last_move_at: new Date().toISOString(),
        })
        .eq('user_id', session?.user?.id)
        .eq('status', 'in_progress')
        .eq('game_type', 'reversi');

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
              className="w-12 h-12 bg-green-700 flex items-center justify-center"
              onClick={() => makeMove(i, j)}
            >
              {cell > 0 && (
                <div 
                  className={`w-8 h-8 rounded-full transition-all
                    ${cell === 1 ? 'bg-black' : 'bg-white'}`}
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
              <div>Black: {gameState.scores.black}</div>
              <div>White: {gameState.scores.white}</div>
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
