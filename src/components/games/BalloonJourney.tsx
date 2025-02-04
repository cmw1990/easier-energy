import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BreathingTechniques, type BreathingTechnique } from '@/components/breathing/BreathingTechniques';
import { BalloonScene3D } from './scenes/BalloonScene3D';

const BalloonJourney = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const { toast } = useToast();

  const handleStartStop = () => {
    if (!selectedTechnique) {
      toast({
        title: "Please select a breathing technique",
        description: "Choose a breathing technique before starting the game",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(prev => !prev);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        {!isPlaying && (
          <BreathingTechniques
            onSelectTechnique={setSelectedTechnique}
            className="mb-4"
          />
        )}
        
        <div className="w-full max-w-3xl">
          <BalloonScene3D breathPhase={breathPhase} />
        </div>
        
        {!isPlaying && (
          <Button 
            onClick={handleStartStop}
            className="w-40"
          >
            Start Game
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BalloonJourney;
