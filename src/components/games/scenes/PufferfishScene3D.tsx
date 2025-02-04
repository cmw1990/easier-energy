import { useState, useEffect } from 'react';
import { usePhaserGame } from '@/hooks/use-phaser-game';
import { PufferfishScene } from './PufferfishScene';
import { Loader2 } from 'lucide-react';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

export const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gameRef = usePhaserGame({
    width: 800,
    height: 400,
    parent: 'game-container',
    scene: PufferfishScene,
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
      antialias: true,
      pixelArt: false,
      transparent: true
    }
  });

  useEffect(() => {
    const initializeGame = async () => {
      try {
        if (gameRef.current) {
          const scene = gameRef.current.scene.getScene('PufferfishScene') as PufferfishScene;
          if (scene) {
            scene.init({ breathPhase });
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Error initializing game:', err);
        setError('Failed to initialize game. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [gameRef, breathPhase]);

  if (error) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-destructive/10 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full aspect-video relative bg-background">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <div id="game-container" className="w-full h-full" />
    </div>
  );
};