import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

export const GameAssetsGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAssets = async () => {
    setIsGenerating(true);
    try {
      // Generate all assets in sequence
      const batches = [
        'memory-cards',
        'sequence-memory',
        'visual-memory',
        'pattern-match',
        'color-match',
        'word-scramble',
        'math-speed',
        'simon-says',
        'speed-typing'
      ];
      
      for (const batch of batches) {
        console.log(`Starting generation for ${batch} assets...`);
        
        const { data, error } = await supabase.functions.invoke(
          'generate-initial-game-assets',
          { 
            body: { batch },
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (error) {
          console.error(`Error generating ${batch} assets:`, error);
          throw error;
        }
        
        console.log(`${batch} Asset Generation Response:`, data);
        
        // Wait between batches to avoid resource limits
        if (batch !== batches[batches.length - 1]) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      toast({
        title: 'Success!',
        description: 'All game assets generated successfully!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error generating game assets:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate game assets. Check console for details.',
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