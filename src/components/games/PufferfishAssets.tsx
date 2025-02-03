import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GameAssets {
  pufferfish: string;
  bubbles: string;
  coral: string;
  seaweed: string;
  smallFish: string;
  predator: string;
  background: string;
}

export const usePufferfishAssets = () => {
  const [assets, setAssets] = useState<Partial<GameAssets>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadAsset = async (assetType: keyof GameAssets, retryCount = 0) => {
    try {
      console.log(`Loading ${assetType}, attempt ${retryCount + 1}`);
      const { data, error } = await supabase.functions.invoke('generate-pufferfish-assets', {
        body: { assetType }
      });

      if (error) {
        console.error(`Error loading ${assetType}:`, error);
        if (retryCount < 2) { // Max 3 attempts
          console.log(`Retrying ${assetType}...`);
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount + 1) * 1000));
          return loadAsset(assetType, retryCount + 1);
        }
        throw error;
      }
      
      if (!data?.image) {
        throw new Error(`No image data received for ${assetType}`);
      }

      return `data:image/png;base64,${data.image}`;
    } catch (error) {
      console.error(`Error loading ${assetType}:`, error);
      toast({
        title: "Error Loading Game Assets",
        description: `Failed to load ${assetType}. Please try refreshing.`,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    const loadAllAssets = async () => {
      setIsLoading(true);
      const assetTypes: (keyof GameAssets)[] = [
        'pufferfish', 'bubbles', 'coral', 'seaweed', 
        'smallFish', 'predator', 'background'
      ];

      const loadedAssets: Partial<GameAssets> = {};
      let failedAssets = 0;
      
      for (const type of assetTypes) {
        const asset = await loadAsset(type);
        if (asset) {
          loadedAssets[type] = asset;
        } else {
          failedAssets++;
        }
      }

      setAssets(loadedAssets);
      setIsLoading(false);

      // Show appropriate toast based on loading results
      if (failedAssets === 0) {
        toast({
          title: "Assets Loaded Successfully",
          description: "All game assets have been loaded.",
        });
      } else if (failedAssets < assetTypes.length) {
        toast({
          title: "Some Assets Failed to Load",
          description: "The game will work, but some visuals might be missing. Try refreshing.",
          variant: "destructive",
        });
      }
    };

    loadAllAssets();
  }, []);

  return { assets, isLoading };
};