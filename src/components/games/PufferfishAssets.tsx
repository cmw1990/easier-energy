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
      const { data, error } = await supabase.functions.invoke('generate-pufferfish-assets', {
        body: { assetType }
      });

      if (error) throw error;
      
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
      
      for (const type of assetTypes) {
        const asset = await loadAsset(type);
        if (asset) {
          loadedAssets[type] = asset;
        }
      }

      setAssets(loadedAssets);
      setIsLoading(false);
    };

    loadAllAssets();
  }, []);

  return { assets, isLoading };
};