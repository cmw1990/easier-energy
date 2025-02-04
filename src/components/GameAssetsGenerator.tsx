import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

// Only show this component in development
const isDevelopment = import.meta.env.DEV;

export const GameAssetsGenerator = () => {
  if (!isDevelopment) return null;
  
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const checkExistingAssets = async (batch: string) => {
    try {
      console.log(`Checking storage for ${batch} assets...`);
      const { data, error } = await supabase
        .storage
        .from('game-assets')
        .list(batch, {
          limit: 1,
          offset: 0,
        });

      if (error) {
        console.error(`Error checking existing assets for ${batch}:`, error);
        throw error;
      }
      
      const hasAssets = data && data.length > 0;
      console.log(`${batch} assets exist:`, hasAssets);
      return hasAssets;
    } catch (error) {
      console.error(`Error checking existing assets for ${batch}:`, error);
      return false;
    }
  };

  const generateAssets = async () => {
    setIsGenerating(true);
    try {
      const batches = [
        {
          name: 'balloon',
          description: '3D balloon game assets including a detailed hot air balloon model, dreamy sky environment, and particle effects',
        },
        {
          name: 'pufferfish',
          description: '3D pufferfish game assets including an animated pufferfish model, underwater environment, and bubble effects',
        },
        {
          name: 'zen-garden',
          description: '3D zen garden assets including stones, sand patterns, and atmospheric effects',
        }
      ];
      
      for (const batch of batches) {
        try {
          console.log(`Starting process for ${batch.name}...`);
          const hasExisting = await checkExistingAssets(batch.name);
          
          if (hasExisting) {
            console.log(`Skipping ${batch.name} - assets already exist`);
            toast({
              title: `${batch.name} assets exist`,
              description: "Skipping generation as assets already exist",
            });
            continue;
          }

          console.log(`Invoking edge function for ${batch.name}...`);
          
          const { data, error } = await supabase.functions.invoke(
            'generate-initial-game-assets',
            {
              body: {
                batch: batch.name,
                type: 'game-assets',
                is3D: true,
                description: batch.description
              }
            }
          );

          if (error) {
            console.error(`Error generating ${batch.name} assets:`, error);
            toast({
              title: `Error generating ${batch.name} assets`,
              description: error.message || 'Unknown error occurred',
              variant: 'destructive',
            });
            continue;
          }
          
          console.log(`${batch.name} generation response:`, data);
          
          toast({
            title: 'Success',
            description: `Generated 3D assets for ${batch.name}`,
          });
          
          // Add delay between batches to avoid rate limits
          if (batch !== batches[batches.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } catch (batchError) {
          console.error(`Error processing batch ${batch.name}:`, batchError);
          toast({
            title: `Error with ${batch.name}`,
            description: batchError.message || 'Failed to process batch',
            variant: 'destructive',
          });
          continue;
        }
      }
      
      toast({
        title: 'Success!',
        description: 'All 3D game assets generation completed!',
      });
    } catch (error) {
      console.error('Error generating game assets:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate game assets',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generateAssets} 
      disabled={isGenerating}
      className="gap-2 bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-lg transition-all duration-300"
    >
      {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
      {!isGenerating && <Sparkles className="h-4 w-4 animate-pulse" />}
      {isGenerating ? 'Generating 3D Game Assets...' : 'Generate 3D Game Assets'}
    </Button>
  );
};