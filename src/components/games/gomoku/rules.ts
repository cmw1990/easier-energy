import type { GomokuState, Player } from './types';

const WIN_LENGTH = 5;

export const checkWin = (row: number, col: number, board: string[][]): boolean => {
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
        newRow < 0 || newRow >= board.length || 
        newCol < 0 || newCol >= board.length ||
        board[newRow][newCol] !== color
      ) break;
      count++;
    }
    
    // Check in negative direction
    for (let i = 1; i < WIN_LENGTH; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (
        newRow < 0 || newRow >= board.length || 
        newCol < 0 || newCol >= board.length ||
        board[newRow][newCol] !== color
      ) break;
      count++;
    }
    
    if (count >= WIN_LENGTH) return true;
  }
  
  return false;
};

export const isValidMove = (
  row: number,
  col: number,
  state: GomokuState,
): boolean => {
  if (state.board[row][col] !== '') return false;
  
  if (state.variant === 'pro' && state.currentPlayer === 'black') {
    // Check for 3x3 and 4x4 restrictions
    if (hasDoubleThree(row, col, state.board)) return false;
    if (hasDoubleFour(row, col, state.board)) return false;
  }
  
  return true;
};

const hasDoubleThree = (row: number, col: number, board: string[][]): boolean => {
  // Implementation of 3x3 restriction check
  // This is a placeholder - actual implementation would check for double-three patterns
  return false;
};

const hasDoubleFour = (row: number, col: number, board: string[][]): boolean => {
  // Implementation of 4x4 restriction check
  // This is a placeholder - actual implementation would check for double-four patterns
  return false;
};

export const handleSwap2Move = (
  row: number,
  col: number,
  state: GomokuState,
): GomokuState => {
  const newState = { ...state };
  
  if (!state.isSwap2Phase) {
    return newState;
  }
  
  const swap2Moves = state.swap2Moves || [];
  
  if (swap2Moves.length < 3) {
    // First three moves of Swap2 opening
    newState.swap2Moves = [...swap2Moves, [row, col]];
    if (newState.swap2Moves.length === 3) {
      newState.currentPlayer = 'white'; // White chooses to swap or continue
    }
  } else {
    // White's decision phase
    newState.isSwap2Phase = false;
    newState.swap2Moves = undefined;
    // Implement the actual swap logic here
  }
  
  return newState;
};