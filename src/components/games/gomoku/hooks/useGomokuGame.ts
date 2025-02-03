import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { checkWin, isValidMove, handleSwap2Move } from '../rules';
import type { GomokuState, GomokuSettings } from '../types';

export const useGomokuGame = () => {
  const [gameState, setGameState] = useState<GomokuState>({
    board: Array(15).fill(null).map(() => Array(15).fill('')),
    currentPlayer: 'black',
    status: 'in_progress',
    winner: null,
    variant: 'standard',
    boardSize: 15,
    moveHistory: [],
  });
  
  const [settings, setSettings] = useState<GomokuSettings>({
    variant: 'standard',
    boardSize: 15,
    difficulty: '1',
  });

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
        const loadedGameState = existingGame.game_state as unknown as GomokuState;
        setGameState(loadedGameState);
        setSettings({
          variant: existingGame.variant as GomokuSettings['variant'],
          boardSize: existingGame.board_size as GomokuSettings['boardSize'],
          difficulty: existingGame.difficulty_level.toString(),
        });
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
    const initialGameState: GomokuState = {
      board: Array(settings.boardSize).fill(null).map(() => Array(settings.boardSize).fill('')),
      currentPlayer: 'black',
      status: 'in_progress',
      winner: null,
      variant: settings.variant,
      boardSize: settings.boardSize,
      moveHistory: [],
      ...(settings.variant === 'swap2' ? {
        isSwap2Phase: true,
        swap2Moves: [],
      } : {}),
    };

    try {
      const { error } = await supabase
        .from('board_games')
        .insert([{
          game_type: 'gomoku',
          difficulty_level: parseInt(settings.difficulty),
          game_state: initialGameState as unknown as Json,
          variant: settings.variant,
          board_size: settings.boardSize,
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

  const makeMove = async (row: number, col: number) => {
    if (gameState.status === 'completed' || !isValidMove(row, col, gameState)) {
      return;
    }

    let newState = { ...gameState };

    if (gameState.variant === 'swap2' && gameState.isSwap2Phase) {
      newState = handleSwap2Move(row, col, gameState);
      setGameState(newState);
      return;
    }

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = gameState.currentPlayer;
    
    const hasWon = checkWin(row, col, newBoard);
    
    newState = {
      ...newState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
      status: hasWon ? 'completed' : 'in_progress',
      winner: hasWon ? gameState.currentPlayer : null,
      moveHistory: [...gameState.moveHistory, [row, col]],
    };

    setGameState(newState);

    try {
      const { error } = await supabase
        .from('board_games')
        .update({
          game_state: newState as unknown as Json,
          status: newState.status,
          winner: newState.winner,
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

  return {
    gameState,
    settings,
    setSettings,
    makeMove,
    createNewGame,
  };
};