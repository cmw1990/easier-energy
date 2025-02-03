import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [assets, setAssets] = useState<GameAssets>({} as GameAssets);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadAssets = async () => {
      const assetTypes = [
        'pufferfish',
        'bubbles',
        'coral',
        'seaweed',
        'smallFish',
        'predator',
        'background'
      ];

      try {
        const loadedAssets: Partial<GameAssets> = {};
        let loadedCount = 0;

        for (const type of assetTypes) {
          try {
            const { data: publicUrl, error } = await supabase
              .storage
              .from('game-assets')
              .getPublicUrl(`pufferfish/${type}.png`);

            if (error) throw error;
            if (!publicUrl.publicUrl) throw new Error('No public URL received');

            // Pre-load the image
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = publicUrl.publicUrl;
            });

            loadedAssets[type as keyof GameAssets] = publicUrl.publicUrl;
            loadedCount++;
            
            console.log(`Loaded ${type} asset successfully`);
          } catch (err) {
            console.error(`Error loading ${type}:`, err);
            // Use placeholder for failed assets
            loadedAssets[type as keyof GameAssets] = '/placeholder.svg';
          }
        }

        setAssets(loadedAssets as GameAssets);
        
        if (loadedCount < assetTypes.length) {
          console.warn(`Only ${loadedCount} of ${assetTypes.length} assets loaded successfully`);
          toast({
            title: "Some Assets Failed to Load",
            description: "The game will work with placeholder images. Try refreshing if assets are missing.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading game assets:", error);
        toast({
          title: "Error Loading Game Assets",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [toast]);

  return { assets, isLoading };
};