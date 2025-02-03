import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PufferfishAssets {
  pufferfish: string;
  bubbles: string;
  seaweed: string;
  smallFish: string;
  predator: string;
  background: string;
}

export const usePufferfishAssets = () => {
  const [assets, setAssets] = useState<PufferfishAssets>({
    pufferfish: '/placeholder.svg',
    bubbles: '/placeholder.svg',
    seaweed: '/placeholder.svg',
    smallFish: '/placeholder.svg',
    predator: '/placeholder.svg',
    background: '/placeholder.svg'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const assetNames = ['pufferfish', 'bubbles', 'seaweed', 'smallFish', 'predator', 'background'];
        const loadedAssets: Partial<PufferfishAssets> = {};

        for (const name of assetNames) {
          const { data } = await supabase
            .storage
            .from('game-assets')
            .getPublicUrl(`pufferfish/${name}.png`);

          if (data?.publicUrl) {
            loadedAssets[name as keyof PufferfishAssets] = data.publicUrl;
          }
        }

        // Only update if we have all assets
        if (Object.keys(loadedAssets).length === assetNames.length) {
          setAssets(loadedAssets as PufferfishAssets);
        } else {
          throw new Error('Some assets failed to load');
        }
      } catch (err) {
        console.error('Error loading pufferfish assets:', err);
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

  const generateAssets = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.functions.invoke('generate-pufferfish-assets');
      
      if (error) throw error;
      
      toast({
        title: "Assets Generated",
        description: "New game assets have been created and saved!",
      });

      // Reload assets after generation
      window.location.reload();
    } catch (err) {
      console.error('Error generating assets:', err);
      toast({
        title: "Generation Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assets,
    isLoading,
    error,
    generateAssets
  };
};