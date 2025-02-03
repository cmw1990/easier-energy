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

  const loadAsset = async (assetType: keyof GameAssets) => {
    try {
      console.log(`Attempting to load asset: ${assetType}`);
      
      const { data, error } = await supabase.functions.invoke('generate-pufferfish-assets', {
        body: { assetType }
      });

      if (error) {
        console.error(`Error loading ${assetType}:`, error);
        throw error;
      }

      if (!data?.image) {
        console.error(`No image data received for ${assetType}`);
        throw new Error('No image data received');
      }
      
      console.log(`Successfully loaded asset: ${assetType}`);
      return `data:image/png;base64,${data.image}`;
    } catch (error) {
      console.error(`Error loading ${assetType}:`, error);
      toast({
        title: "Error Loading Game Assets",
        description: `Failed to load ${assetType}. ${error.message || 'Please try refreshing.'}`,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    const loadAllAssets = async () => {
      console.log('Starting to load all assets...');
      setIsLoading(true);
      
      const assetTypes: (keyof GameAssets)[] = [
        'pufferfish', 'bubbles', 'coral', 'seaweed', 
        'smallFish', 'predator', 'background'
      ];

      const loadedAssets: Partial<GameAssets> = {};
      
      for (const type of assetTypes) {
        const asset = await loadAsset(type);
        if (asset) {
          loadedAssets[type] = asset;
        }
      }

      console.log('Finished loading assets:', Object.keys(loadedAssets));
      setAssets(loadedAssets);
      setIsLoading(false);
    };

    loadAllAssets();
  }, []);

  return { assets, isLoading };
};