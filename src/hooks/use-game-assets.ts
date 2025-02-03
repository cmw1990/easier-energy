import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GameAsset {
  url: string;
  type: string;
  loaded: boolean;
}

interface AssetCache {
  [key: string]: {
    url: string;
    timestamp: number;
  };
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
let assetCache: AssetCache = {};

export const useGameAssets = (gameType: string) => {
  const [assets, setAssets] = useState<Record<string, GameAsset>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const isCacheValid = (timestamp: number) => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  const loadImage = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const fetchAsset = async (type: string, retryCount = 0): Promise<string | null> => {
    try {
      // Check cache first
      const cached = assetCache[`${gameType}/${type}`];
      if (cached && isCacheValid(cached.timestamp)) {
        console.log(`Using cached asset for ${gameType}/${type}`);
        return cached.url;
      }

      const { data: publicUrl } = await supabase
        .storage
        .from('game-assets')
        .getPublicUrl(`${gameType}/${type}.png`);

      if (!publicUrl.publicUrl) {
        throw new Error(`No public URL received for ${type}`);
      }

      // Pre-load image
      const loaded = await loadImage(publicUrl.publicUrl);
      if (!loaded) {
        throw new Error(`Failed to load image for ${type}`);
      }

      // Update cache
      assetCache[`${gameType}/${type}`] = {
        url: publicUrl.publicUrl,
        timestamp: Date.now()
      };

      return publicUrl.publicUrl;
    } catch (err) {
      console.warn(`Error loading ${type}, attempt ${retryCount + 1}:`, err);
      
      // Retry logic with exponential backoff
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return fetchAsset(type, retryCount + 1);
      }
      
      return null;
    }
  };

  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const assetTypes = await getAssetTypesForGame(gameType);
        const loadedAssets: Record<string, GameAsset> = {};
        let failedCount = 0;

        await Promise.all(
          assetTypes.map(async (type) => {
            const url = await fetchAsset(type);
            if (url) {
              loadedAssets[type] = {
                url,
                type,
                loaded: true
              };
            } else {
              failedCount++;
              loadedAssets[type] = {
                url: '/placeholder.svg', // Fallback image
                type,
                loaded: false
              };
            }
          })
        );

        setAssets(loadedAssets);
        
        if (failedCount > 0) {
          toast({
            title: "Some Assets Failed to Load",
            description: "Using fallback images where needed. Try using the Generate Game Assets button to fix this.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error loading game assets:', err);
        setError('Failed to load game assets');
        toast({
          title: "Error Loading Game Assets",
          description: "Please try using the Generate Game Assets button to fix this.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [gameType, toast]);

  return { assets, isLoading, error };
};

const getAssetTypesForGame = async (gameType: string): Promise<string[]> => {
  switch (gameType) {
    case 'balloon':
      return ['balloon', 'mountains', 'clouds', 'obstacles', 'background'];
    case 'zen-drift':
      return ['cars/car_1', 'cars/car_2', 'backgrounds/background_1', 'effects/effect_1'];
    case 'zen-garden':
      return ['stone', 'sand-pattern', 'bonsai', 'moss', 'bamboo', 'lantern', 'bridge', 'koi'];
    default:
      return [];
  }
};