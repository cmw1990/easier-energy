import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface GameStatusProps {
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  winner?: string | null;
  currentPlayer: string;
}

export const GameStatus = ({ status, winner, currentPlayer }: GameStatusProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        {status === 'not_started' && (
          <>
            <AlertCircle className="text-yellow-500" />
            <span>Game not started</span>
          </>
        )}
        {status === 'in_progress' && (
          <>
            <Loader2 className="animate-spin text-blue-500" />
            <span>Current player: {currentPlayer}</span>
          </>
        )}
        {status === 'completed' && (
          <>
            <CheckCircle2 className="text-green-500" />
            <span>{winner ? `Winner: ${winner}` : 'Game ended in a draw'}</span>
          </>
        )}
      </div>
    </Card>
  );
};