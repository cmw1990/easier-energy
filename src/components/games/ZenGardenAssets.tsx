import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface ZenGardenAssets {
  stone: string;
  lantern: string;
  bonsai: string;
  bridge: string;
}

export const useZenGardenAssets = () => {
  const [assets, setAssets] = useState<ZenGardenAssets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const requiredAssets: (keyof ZenGardenAssets)[] = ['stone', 'lantern', 'bonsai', 'bridge'];
        const loadedAssets = {} as ZenGardenAssets;

        for (const asset of requiredAssets) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('game-assets')
            .getPublicUrl(`zen-garden/${asset}.png`);

          if (!publicUrl) {
            throw new Error(`Failed to load ${asset} asset`);
          }

          loadedAssets[asset] = publicUrl;
        }

        setAssets(loadedAssets);
      } catch (err) {
        console.error('Error loading zen garden assets:', err);
        setError('Failed to load game assets');
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  return {
    assets,
    isLoading,
    error
  };
};