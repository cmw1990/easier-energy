import { Card } from '@/components/ui/card';

interface MoveHistoryProps {
  moves: string[];
}

export const MoveHistory = ({ moves }: MoveHistoryProps) => {
  return (
    <Card className="p-4 max-h-60 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Move History</h3>
      <div className="space-y-1">
        {moves.map((move, index) => (
          <div key={index} className="text-sm">
            {index + 1}. {move}
          </div>
        ))}
      </div>
    </Card>
  );
};