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
      const { data, error } = await supabase.functions.invoke('generate-initial-game-assets');
      
      if (error) throw error;
      
      console.log('Asset Generation Response:', data);
      
      toast({
        title: data.success ? 'Success!' : 'Error',
        description: data.success ? 'Game assets generation started!' : 'Failed to generate game assets',
        variant: data.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error generating game assets:', error);
      toast({
        title: 'Error',
        description: 'Failed to start game assets generation. Check console for details.',
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