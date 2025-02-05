import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ZenGardenAssets {
  stones: string;
  sand: string;
  background: string;
}

export const useZenGardenAssets = () => {
  const [assets, setAssets] = useState<ZenGardenAssets>({
    stones: '/placeholder.svg',
    sand: '/placeholder.svg',
    background: '/placeholder.svg'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const assetNames = ['stones', 'sand', 'background'];
        const loadedAssets: Partial<ZenGardenAssets> = {};

        for (const name of assetNames) {
          const { data } = await supabase
            .storage
            .from('game-assets')
            .getPublicUrl(`zen-garden/${name}.png`);

          if (data?.publicUrl) {
            loadedAssets[name as keyof ZenGardenAssets] = data.publicUrl;
          }
        }

        if (Object.keys(loadedAssets).length === assetNames.length) {
          setAssets(loadedAssets as ZenGardenAssets);
        } else {
          throw new Error('Some assets failed to load');
        }
      } catch (err) {
        console.error('Error loading zen garden assets:', err);
        setError(err as Error);
        toast({
          title: "Asset Loading Error",
          description: "Using placeholder images for now. The game will still work!",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [toast]);

  return {
    assets,
    isLoading,
    error
  };
};