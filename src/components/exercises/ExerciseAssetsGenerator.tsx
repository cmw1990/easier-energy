import { useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";

// Only show this component in development
const isDevelopment = import.meta.env.DEV;

export const ExerciseAssetsGenerator = () => {
  if (!isDevelopment) return null;
  
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

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
            // Check for billing limit error
            if (error.message?.includes('billing') || 
                (typeof error === 'object' && 
                 error.body && 
                 JSON.parse(error.body)?.code === 'BILLING_LIMIT')) {
              toast({
                title: 'OpenAI Billing Limit Reached',
                description: 'Please check your OpenAI account billing status before continuing.',
                variant: 'destructive',
              });
              // Stop the entire process
              return;
            }
            
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
      {isGenerating ? 'Generating Exercise Assets...' : 'Generate Exercise Assets'}
    </Button>
  );
};

export default ExerciseAssetsGenerator;