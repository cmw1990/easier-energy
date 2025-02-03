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
        let attempt = 1;
        const maxAttempts = 3;

        for (const type of assetTypes) {
          let success = false;
          while (!success && attempt <= maxAttempts) {
            try {
              console.log(`Loading ${type}, attempt ${attempt}`);
              const { data, error } = await supabase.functions.invoke('generate-pufferfish-assets', {
                body: { assetType: type }
              });

              if (error) throw error;
              if (!data?.image) throw new Error('No image data received');

              loadedAssets[type as keyof GameAssets] = `data:image/png;base64,${data.image}`;
              loadedCount++;
              success = true;
              console.log(`Successfully generated ${type} asset`);
            } catch (err) {
              console.error(`Error loading ${type} on attempt ${attempt}:`, err);
              attempt++;
              if (attempt <= maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
              }
            }
          }
          attempt = 1; // Reset for next asset
        }

        setAssets(loadedAssets as GameAssets);
        
        if (loadedCount < assetTypes.length) {
          console.warn(`Only ${loadedCount} of ${assetTypes.length} assets loaded successfully`);
          toast({
            title: "Some Assets Failed to Load",
            description: "The game will work, but some visuals might be missing. Try refreshing.",
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