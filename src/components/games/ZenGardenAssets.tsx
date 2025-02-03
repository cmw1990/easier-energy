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
        const elements = ['stone', 'lantern', 'bonsai', 'bridge'];
        const loadedAssets: Record<string, string> = {};

        for (const element of elements) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('game-assets')
            .getPublicUrl(`zen-garden/${element}.png`);

          loadedAssets[element] = publicUrl;
        }

        setAssets(loadedAssets as ZenGardenAssets);
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