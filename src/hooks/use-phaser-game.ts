import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface GameConfig {
  width: number;
  height: number;
  parent: string;
  scene: Phaser.Scene;
}

export const usePhaserGame = (config: GameConfig) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        ...config,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        render: {
          pixelArt: false,
          antialias: true,
          antialiasGL: true
        }
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [config]);

  return gameRef;
};