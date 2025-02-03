import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

export const GameAssetsGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const checkExistingAssets = async (batch: string) => {
    try {
      console.log(`Checking storage for ${batch} assets...`);
      const { data, error } = await supabase
        .storage
        .from('game-assets')
        .list(batch);

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
        'memory-cards',
        'sequence-memory',
        'visual-memory',
        'pattern-match',
        'color-match',
        'word-scramble',
        'math-speed',
        'simon-says',
        'speed-typing',
        'pufferfish'
      ];
      
      for (const batch of batches) {
        try {
          console.log(`Starting process for ${batch}...`);
          const hasExisting = await checkExistingAssets(batch);
          
          if (hasExisting) {
            console.log(`Skipping ${batch} - assets already exist`);
            continue;
          }

          console.log(`Invoking edge function for ${batch}...`);
          
          const { data, error } = await supabase.functions.invoke(
            'generate-initial-game-assets',
            { 
              body: JSON.stringify({ batch }),
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          
          if (error) {
            console.error(`Error generating ${batch} assets:`, error);
            toast({
              title: `Error generating ${batch} assets`,
              description: error.message || 'Unknown error occurred',
              variant: 'destructive',
            });
            continue; // Continue with next batch even if this one fails
          }
          
          console.log(`${batch} generation response:`, data);
          
          toast({
            title: 'Success',
            description: `Generated assets for ${batch}`,
            variant: 'default',
          });
          
          // Wait between batches to avoid resource limits
          if (batch !== batches[batches.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } catch (batchError) {
          console.error(`Error processing batch ${batch}:`, batchError);
          toast({
            title: `Error with ${batch}`,
            description: batchError.message || 'Failed to process batch',
            variant: 'destructive',
          });
          continue; // Continue with next batch even if this one fails
        }
      }
      
      toast({
        title: 'Success!',
        description: 'Game assets generation completed!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error generating game assets:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate game assets. Check console for details.',
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
      {isGenerating ? 'Generating Game Assets...' : 'Generate Game Assets'}
    </Button>
  );
};