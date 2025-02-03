import { Button } from '@/components/ui/button';
import { RefreshCw, Undo, Redo } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const GameControls = ({
  onNewGame,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}: GameControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onNewGame} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        New Game
      </Button>
      {onUndo && (
        <Button 
          onClick={onUndo} 
          variant="outline" 
          size="sm"
          disabled={!canUndo}
        >
          <Undo className="h-4 w-4 mr-2" />
          Undo
        </Button>
      )}
      {onRedo && (
        <Button 
          onClick={onRedo} 
          variant="outline" 
          size="sm"
          disabled={!canRedo}
        >
          <Redo className="h-4 w-4 mr-2" />
          Redo
        </Button>
      )}
    </div>
  );
};