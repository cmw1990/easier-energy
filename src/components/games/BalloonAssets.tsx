import balloonImage from '@/assets/games/balloon/balloon.png';
import backgroundImage from '@/assets/games/balloon/background.png';

export interface BalloonAssets {
  balloon: string;
  background: string;
}

export const useBalloonAssets = () => {
  const assets: BalloonAssets = {
    balloon: balloonImage,
    background: backgroundImage,
  };

  return {
    assets,
    isLoading: false,
    error: null
  };
};