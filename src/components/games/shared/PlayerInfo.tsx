import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface PlayerInfoProps {
  currentPlayer: string;
  score?: number;
  isWinner?: boolean;
  className?: string;
}

export const PlayerInfo = ({ currentPlayer, score, isWinner, className = '' }: PlayerInfoProps) => {
  return (
    <Card className={`p-4 ${className} ${isWinner ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            currentPlayer === 'black' ? 'bg-black' : 'bg-white border border-gray-300'
          }`} />
          <span className="font-medium">{currentPlayer}</span>
        </div>
        {score !== undefined && (
          <span className="text-sm text-muted-foreground">
            Score: {score}
          </span>
        )}
        {isWinner && (
          <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
            <Trophy className="h-4 w-4" />
            Winner!
          </div>
        )}
      </div>
    </Card>
  );
};