import pufferfishImage from '@/assets/games/pufferfish/pufferfish.png';
import bubblesImage from '@/assets/games/pufferfish/bubbles.png';
import seaweedImage from '@/assets/games/pufferfish/seaweed.png';
import smallFishImage from '@/assets/games/pufferfish/smallFish.png';
import predatorImage from '@/assets/games/pufferfish/predator.png';
import backgroundImage from '@/assets/games/pufferfish/background.png';

export interface PufferfishAssets {
  pufferfish: string;
  bubbles: string;
  seaweed: string;
  smallFish: string;
  predator: string;
  background: string;
}

export const usePufferfishAssets = () => {
  const assets: PufferfishAssets = {
    pufferfish: pufferfishImage,
    bubbles: bubblesImage,
    seaweed: seaweedImage,
    smallFish: smallFishImage,
    predator: predatorImage,
    background: backgroundImage
  };

  return {
    assets,
    isLoading: false,
    error: null
  };
};