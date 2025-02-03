export type GameType = 'chess' | 'go' | 'checkers' | 'reversi' | 'xiangqi' | 'shogi' | 'gomoku' | 'connect_four' | 'tic_tac_toe';
export type GameStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';
export type Player = 'black' | 'white';

export interface BaseGameState {
  currentPlayer: Player;
  status: GameStatus;
  winner: string | null;
}

export interface CheckersState extends BaseGameState {
  board: number[][];
  captures: {
    black: number;
    white: number;
  };
  kings: number[][];
}

export interface ReversiState extends BaseGameState {
  board: number[][];
  scores: {
    black: number;
    white: number;
  };
  validMoves: [number, number][];
}