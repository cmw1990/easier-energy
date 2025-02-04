import { PufferfishProvider } from '../contexts/PufferfishContext';
import { usePhaserGame } from '@/hooks/use-phaser-game';
import { PufferfishScene } from './PufferfishScene';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

export const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
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

  // Update scene when breath phase changes
  if (gameRef.current) {
    const scene = gameRef.current.scene.getScene('PufferfishScene') as PufferfishScene;
    if (scene) {
      scene.init({ breathPhase });
    }
  }

  return (
    <div className="w-full aspect-video relative">
      <div id="game-container" className="w-full h-full" />
    </div>
  );
};