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
      img.onerror = () => {
        console.error(`Failed to load image from URL: ${url}`);
        resolve(false);
      };
      img.src = url;
    });
  };

  const fetchAsset = async (type: string, retryCount = 0): Promise<string | null> => {
    try {
      // Check cache first
      const cached = assetCache[`${gameType}/${type}`];
      if (cached && isCacheValid(cached.timestamp)) {
        console.log(`Using cached asset for ${gameType}/${type}`);
        const isValid = await loadImage(cached.url);
        if (isValid) {
          return cached.url;
        } else {
          console.log(`Cached image invalid for ${gameType}/${type}, refetching...`);
          delete assetCache[`${gameType}/${type}`];
        }
      }

      console.log(`Fetching asset for ${gameType}/${type}`);
      const { data: urlData } = await supabase
        .storage
        .from('game-assets')
        .getPublicUrl(`${gameType}/${type}.png`);

      if (!urlData?.publicUrl) {
        throw new Error(`No public URL received for ${type}`);
      }

      // Pre-load image
      const loaded = await loadImage(urlData.publicUrl);
      if (!loaded) {
        throw new Error(`Failed to load image for ${type}`);
      }

      // Update cache
      assetCache[`${gameType}/${type}`] = {
        url: urlData.publicUrl,
        timestamp: Date.now()
      };

      return urlData.publicUrl;
    } catch (err) {
      console.error(`Error loading ${type}, attempt ${retryCount + 1}:`, err);
      
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return fetchAsset(type, retryCount + 1);
      }
      
      throw err;
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
            try {
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
                  url: '/placeholder.svg',
                  type,
                  loaded: false
                };
              }
            } catch (assetError) {
              console.error(`Failed to load ${type} asset:`, assetError);
              failedCount++;
              loadedAssets[type] = {
                url: '/placeholder.svg',
                type,
                loaded: false
              };
            }
          })
        );

        setAssets(loadedAssets);
        
        if (failedCount > 0) {
          const message = `Some game assets failed to load. Try using the "Generate Game Assets" button in the top menu to fix this.`;
          console.error(message);
          toast({
            title: "Missing Game Assets",
            description: message,
            variant: "destructive",
          });
          setError(message);
        }
      } catch (err) {
        const message = 'Failed to load game assets. Try using the "Generate Game Assets" button to fix this.';
        console.error(message, err);
        setError(message);
        toast({
          title: "Error Loading Game Assets",
          description: message,
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
      return ['balloon', 'background'];
    case 'zen-drift':
      return ['car', 'background', 'effects'];
    case 'pufferfish':
      return ['pufferfish', 'bubbles', 'coral', 'seaweed', 'smallFish', 'predator', 'background'];
    default:
      console.warn(`No asset types defined for game type: ${gameType}`);
      return [];
  }
};