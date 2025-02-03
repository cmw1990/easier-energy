export type GameType = 'chess' | 'go' | 'checkers' | 'reversi' | 'xiangqi' | 'shogi' | 'gomoku' | 'connect_four' | 'tic_tac_toe';
export type GameStatus = 'not_started' | 'in_progress' | 'completed';
export type Player = 'black' | 'white' | 'red';

export interface BaseGameState {
  currentPlayer: Player;
  status: GameStatus;
  winner: string | null;
}

export interface GameMove {
  from?: [number, number];
  to: [number, number];
  piece?: string;
  capture?: string;
  promotion?: boolean;
  notation: string;
}

export interface GameControls {
  onNewGame: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  difficulty?: string;
  onDifficultyChange?: (value: string) => void;
}

export interface BoardProps {
  rows: number;
  cols: number;
  board: Array<Array<any>>;
  onCellClick: (row: number, col: number) => void;
  selectedPosition?: [number, number] | null;
  validMoves?: [number, number][];
  lastMove?: [number, number];
  renderCell: (row: number, col: number) => React.ReactNode;
}