import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MoveHistoryProps {
  moves: string[];
  className?: string;
}

export const MoveHistory = ({ moves, className = '' }: MoveHistoryProps) => {
  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        Move History
      </h3>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-1">
          {moves.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">
              No moves yet
            </div>
          ) : (
            moves.map((move, index) => (
              <div 
                key={index} 
                className="text-sm hover:bg-accent p-1 rounded-sm transition-colors"
              >
                {index + 1}. {move}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};