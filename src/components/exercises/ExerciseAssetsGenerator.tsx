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
        {
          name: 'desk-exercises',
          description: 'Professional 3D illustrations of desk exercises including neck rolls, shoulder stretches, wrist exercises, with smooth gradients and calming colors',
        },
        {
          name: 'walking-exercise',
          description: 'Beautiful 3D illustrations of walking exercises in nature, with dynamic motion trails and energetic visual elements',
        },
        {
          name: 'running-exercise',
          description: 'Dynamic 3D illustrations of running exercises with motion blur effects and energy visualization',
        },
        {
          name: 'stretching',
          description: 'Elegant 3D illustrations of full-body stretches with flowing lines and peaceful visual elements',
        },
        {
          name: 'desk-yoga',
          description: 'Zen-inspired 3D illustrations of office yoga poses with minimal design and calming visual elements',
        },
        {
          name: 'traditional-yoga',
          description: 'Beautiful 3D illustrations of traditional yoga poses with spiritual elements and serene backgrounds',
        }
      ];

      // Delete all existing assets first
      for (const batch of batches) {
        await deleteExistingAssets(batch.name);
      }

      setIsDeleting(false);
      setIsGenerating(true);
      
      // Generate new assets
      for (const batch of batches) {
        try {
          console.log(`Starting process for ${batch.name}...`);
          
          console.log(`Invoking edge function for ${batch.name}...`);
          
          const { data, error } = await supabase.functions.invoke(
            'generate-exercise-assets',
            {
              body: {
                batch: batch.name,
                type: 'exercise-assets',
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