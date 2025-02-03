import { cn } from '@/lib/utils';

interface GameBoardProps {
  rows: number;
  cols: number;
  renderCell: (row: number, col: number) => React.ReactNode;
  className?: string;
  cellClassName?: string;
}

export const GameBoard = ({
  rows,
  cols,
  renderCell,
  className,
  cellClassName
}: GameBoardProps) => {
  return (
    <div 
      className={cn(
        "grid gap-0.5 bg-gray-700 p-0.5",
        `grid-cols-${cols}`,
        className
      )}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <div
            key={`${row}-${col}`}
            className={cn("w-12 h-12", cellClassName)}
          >
            {renderCell(row, col)}
          </div>
        ))
      )}
    </div>
  );
};