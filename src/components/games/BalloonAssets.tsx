import { useGameAssets } from '@/hooks/use-game-assets';

export interface BalloonAssets {
  balloon: string;
  background: string;
}

export const useBalloonAssets = () => {
  const { assets, isLoading, error } = useGameAssets('balloon');
  
  console.log('Loading balloon assets:', assets);
  
  return {
    assets: {
      balloon: assets?.balloon?.url || '',
      background: assets?.background?.url || ''
    },
    isLoading,
    error
  };
};