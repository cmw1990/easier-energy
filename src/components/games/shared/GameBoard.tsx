import { cn } from '@/lib/utils';

interface GameBoardProps {
  rows: number;
  cols: number;
  renderCell: (row: number, col: number) => React.ReactNode;
  onCellClick?: (row: number, col: number) => void;
  className?: string;
  cellClassName?: string;
  boardClassName?: string;
  highlightedCells?: [number, number][];
  lastMove?: [number, number];
}

export const GameBoard = ({
  rows,
  cols,
  renderCell,
  onCellClick,
  className = '',
  cellClassName = '',
  boardClassName = '',
  highlightedCells = [],
  lastMove,
}: GameBoardProps) => {
  const isHighlighted = (row: number, col: number) => {
    return highlightedCells.some(([r, c]) => r === row && c === col);
  };

  const isLastMove = (row: number, col: number) => {
    return lastMove && lastMove[0] === row && lastMove[1] === col;
  };

  return (
    <div className={cn("relative w-full aspect-square", className)}>
      <div 
        className={cn(
          "grid gap-0.5 bg-gray-700 p-0.5 absolute inset-0",
          `grid-cols-${cols}`,
          boardClassName
        )}
      >
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: cols }, (_, col) => (
            <div
              key={`${row}-${col}`}
              className={cn(
                "relative transition-all duration-200",
                cellClassName,
                isHighlighted(row, col) && "ring-2 ring-yellow-400",
                isLastMove(row, col) && "ring-2 ring-blue-400"
              )}
              onClick={() => onCellClick?.(row, col)}
            >
              {renderCell(row, col)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};