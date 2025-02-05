import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BreathingTechniques, type BreathingTechnique } from '@/components/breathing/BreathingTechniques';
import { BalloonScene3D } from './scenes/BalloonScene3D';
import { Loader2 } from 'lucide-react';

const BalloonJourney = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const { toast } = useToast();

  const handleStartStop = async () => {
    if (!selectedTechnique) {
      toast({
        title: "Please select a breathing technique",
        description: "Choose a breathing technique before starting the game",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      setIsPlaying(prev => !prev);
      if (!isPlaying) {
        // Start breathing cycle
        const phases = ['inhale', 'hold', 'exhale', 'rest'];
        let currentPhaseIndex = 0;

        const interval = setInterval(() => {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          setBreathPhase(phases[currentPhaseIndex] as 'inhale' | 'hold' | 'exhale' | 'rest');
        }, 4000); // 4 seconds per phase

        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        title: "Error Starting Game",
        description: "There was a problem starting the game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        
        {!isPlaying ? (
          <Button 
            onClick={handleStartStop}
            className="w-40"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Start Game'
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleStartStop}
            className="w-40"
            variant="secondary"
          >
            Stop Game
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BalloonJourney;