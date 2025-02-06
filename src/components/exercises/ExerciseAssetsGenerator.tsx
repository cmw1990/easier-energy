
import { useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Trash } from "lucide-react";

// Only show this component in development
const isDevelopment = import.meta.env.DEV;

export const ExerciseAssetsGenerator = () => {
  if (!isDevelopment) return null;
  
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteExistingAssets = async (batch: string) => {
    try {
      console.log(`Deleting assets for ${batch}...`);
      const { data: files, error: listError } = await supabase
        .storage
        .from('exercise-assets')
        .list(batch);

      if (listError) throw listError;

      if (files && files.length > 0) {
        const filePaths = files.map(file => `${batch}/${file.name}`);
        const { error: deleteError } = await supabase
          .storage
          .from('exercise-assets')
          .remove(filePaths);

        if (deleteError) throw deleteError;
        console.log(`Deleted ${filePaths.length} files from ${batch}`);
      }
    } catch (error) {
      console.error(`Error deleting assets for ${batch}:`, error);
      throw error;
    }
  };

  const checkExistingAssets = async (batch: string) => {
    try {
      console.log(`Checking storage for ${batch} assets...`);
      const { data, error } = await supabase
        .storage
        .from('exercise-assets')
        .list(batch, {
          limit: 1,
          offset: 0,
        });

      if (error) {
        console.error(`Error checking existing assets for ${batch}:`, error);
        throw error;
      }
      
      const hasAssets = data && data.length > 0;
      console.log(`${batch} assets exist:`, hasAssets, data);
      return hasAssets;
    } catch (error) {
      console.error(`Error checking existing assets for ${batch}:`, error);
      return false;
    }
  };

  const cleanupAndGenerate = async () => {
    setIsDeleting(true);
    try {
      const batches = [
        '20-20-20',
        'figure-eight',
        'near-far',
        'horizontal',
        'vertical',
        'palming'
      ];

      // Delete all existing assets first
      for (const batch of batches) {
        await deleteExistingAssets(batch);
      }

      setIsDeleting(false);
      setIsGenerating(true);
      
      // Generate new assets
      for (const batch of batches) {
        try {
          console.log(`Starting process for ${batch}...`);
          
          console.log(`Invoking edge function for ${batch}...`);
          
          const { data, error } = await supabase.functions.invoke(
            'generate-assets',
            {
              body: {
                batch,
                type: 'exercise-assets',
                description: `Professional illustration of ${batch.replace(/-/g, ' ')} eye exercise, showing eye movement pattern and proper technique, simple vector style, clean design`,
                style: 'clean vector illustration style with soft colors, medical illustration quality'
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
            continue;
          }
          
          console.log(`${batch} generation response:`, data);
          
          toast({
            title: 'Success',
            description: `Generated assets for ${batch}`,
          });
          
          // Add delay between batches to avoid rate limits
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
          continue;
        }
      }
      
      toast({
        title: 'Success!',
        description: 'All exercise assets generation completed!',
      });
    } catch (error) {
      console.error('Error generating exercise assets:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate exercise assets',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={cleanupAndGenerate} 
      disabled={isGenerating || isDeleting}
      className="gap-2 bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-lg transition-all duration-300"
    >
      {isDeleting && <Trash className="h-4 w-4 animate-pulse text-red-500" />}
      {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
      {!isGenerating && !isDeleting && <Sparkles className="h-4 w-4 animate-pulse" />}
      {isDeleting ? 'Cleaning up old assets...' : 
       isGenerating ? 'Generating Exercise Assets...' : 
       'Generate Exercise Assets'}
    </Button>
  );
};

export default ExerciseAssetsGenerator;
