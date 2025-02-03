import { Card } from '@/components/ui/card';

interface PlayerInfoProps {
  currentPlayer: string;
  score?: number;
  isWinner?: boolean;
}

export const PlayerInfo = ({ currentPlayer, score, isWinner }: PlayerInfoProps) => {
  return (
    <Card className="p-4">
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
          <span className="text-sm font-medium text-green-600">
            Winner!
          </span>
        )}
      </div>
    </Card>
  );
};