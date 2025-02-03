import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export const XiangqiGame = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('red');
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  function initializeBoard() {
    const board = Array(10).fill(null).map(() => Array(9).fill(null));
    
    // Initialize red pieces (bottom)
    board[9][0] = 'R車';
    board[9][1] = 'R馬';
    board[9][2] = 'R象';
    board[9][3] = 'R士';
    board[9][4] = 'R將';
    board[9][5] = 'R士';
    board[9][6] = 'R象';
    board[9][7] = 'R馬';
    board[9][8] = 'R車';
    board[7][1] = 'R砲';
    board[7][7] = 'R砲';
    board[6][0] = 'R兵';
    board[6][2] = 'R兵';
    board[6][4] = 'R兵';
    board[6][6] = 'R兵';
    board[6][8] = 'R兵';

    // Initialize black pieces (top)
    board[0][0] = 'B車';
    board[0][1] = 'B馬';
    board[0][2] = 'B象';
    board[0][3] = 'B士';
    board[0][4] = 'B將';
    board[0][5] = 'B士';
    board[0][6] = 'B象';
    board[0][7] = 'B馬';
    board[0][8] = 'B車';
    board[2][1] = 'B砲';
    board[2][7] = 'B砲';
    board[3][0] = 'B兵';
    board[3][2] = 'B兵';
    board[3][4] = 'B兵';
    board[3][6] = 'B兵';
    board[3][8] = 'B兵';

    return board;
  }

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedPiece) {
      // Select piece if it belongs to current player
      if (board[row][col] && board[row][col].startsWith(currentPlayer === 'red' ? 'R' : 'B')) {
        setSelectedPiece([row, col]);
      }
    } else {
      // Move piece if valid
      const [selectedRow, selectedCol] = selectedPiece;
      if (isValidMove(selectedRow, selectedCol, row, col)) {
        const newBoard = [...board.map(row => [...row])];
        newBoard[row][col] = board[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = null;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
        saveGameState(newBoard);
      }
      setSelectedPiece(null);
    }
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Basic validation - can't capture own pieces
    if (board[toRow][toCol]?.startsWith(currentPlayer === 'red' ? 'R' : 'B')) {
      return false;
    }
    
    // TODO: Implement specific piece movement rules
    return true;
  };

  const saveGameState = async (newBoard: (string | null)[][]) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('board_games')
        .insert({
          user_id: session.user.id,
          game_type: 'xiangqi',
          game_state: {
            board: newBoard,
            currentPlayer,
          },
        });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error saving game",
        description: "There was an error saving your game state.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Xiangqi (Chinese Chess)</h2>
        <div className="mb-4">Current Player: {currentPlayer === 'red' ? 'Red' : 'Black'}</div>
        <div className="grid grid-cols-9 gap-1 bg-amber-100 p-4 rounded-lg">
          {board.map((row, rowIndex) => (
            row.map((piece, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-12 h-12 border border-amber-900 flex items-center justify-center
                  ${selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex
                    ? 'bg-amber-300'
                    : 'bg-amber-50'}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                <span className={`text-xl ${piece?.startsWith('R') ? 'text-red-600' : 'text-gray-900'}`}>
                  {piece?.substring(1)}
                </span>
              </button>
            ))
          ))}
        </div>
        <Button 
          className="mt-4"
          onClick={() => {
            setBoard(initializeBoard());
            setCurrentPlayer('red');
            setSelectedPiece(null);
          }}
        >
          New Game
        </Button>
      </div>
    </Card>
  );
};