import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const GameAssetsGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAssets = async () => {
    setIsGenerating(true);
    try {
      // First try generating pufferfish assets
      const { data: pufferfishData, error: pufferfishError } = await supabase.functions.invoke(
        'generate-initial-game-assets',
        { body: { batch: 'pufferfish' } }
      );
      
      if (pufferfishError) throw pufferfishError;
      
      console.log('Pufferfish Asset Generation Response:', pufferfishData);
      
      // Wait a bit before starting balloon assets to avoid resource limits
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Then try generating balloon assets
      const { data: balloonData, error: balloonError } = await supabase.functions.invoke(
        'generate-initial-game-assets',
        { body: { batch: 'balloon' } }
      );
      
      if (balloonError) throw balloonError;
      
      console.log('Balloon Asset Generation Response:', balloonData);
      
      toast({
        title: 'Success!',
        description: 'Game assets generation completed!',
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
      className="gap-2"
    >
      {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
      {isGenerating ? 'Generating Assets...' : 'Generate Game Assets'}
    </Button>
  );
};