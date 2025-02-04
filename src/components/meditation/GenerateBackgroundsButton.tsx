import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image } from "lucide-react";

export const GenerateBackgroundsButton = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAllBackgrounds = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-meditation-backgrounds',
        {
          body: { generateAll: true }
        }
      );

      if (error) throw error;

      const successCount = data.results.filter(r => r.success).length;
      const failCount = data.results.filter(r => !r.success).length;

      toast({
        title: 'Background Generation Complete',
        description: `Successfully generated ${successCount} backgrounds${failCount > 0 ? `, ${failCount} failed` : ''}`,
        variant: successCount > 0 ? 'default' : 'destructive',
      });

    } catch (error) {
      console.error('Error generating backgrounds:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate backgrounds',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generateAllBackgrounds}
      disabled={isGenerating}
      variant="outline"
      className="gap-2"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Image className="h-4 w-4" />
      )}
      {isGenerating ? 'Generating Backgrounds...' : 'Generate All Backgrounds'}
    </Button>
  );
};

export default GenerateBackgroundsButton;