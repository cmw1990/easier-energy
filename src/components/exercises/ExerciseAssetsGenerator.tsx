
import { useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

const isDevelopment = import.meta.env.DEV;

export const ExerciseAssetsGenerator = () => {
  if (!isDevelopment) return null;
  
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAsset = async (batch: string) => {
    setCurrentBatch(batch);
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log(`Starting generation for ${batch}...`);
      
      const { data, error } = await supabase.functions.invoke(
        'generate-assets',
        {
          body: {
            type: 'exercise-assets',
            batch: batch
          }
        }
      );

      if (error) {
        console.error(`Function error for ${batch}:`, error);
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data?.url) {
        console.error(`No URL in response for ${batch}:`, data);
        throw new Error('No image URL in response');
      }

      console.log(`Generated asset for ${batch}:`, data);
      
      toast({
        title: 'Success',
        description: `Generated asset for ${batch}`,
      });

    } catch (error) {
      console.error(`Error generating ${batch}:`, error);
      setError(error.message);
      toast({
        title: 'Error',
        description: `Failed to generate ${batch}: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setCurrentBatch(null);
    }
  };

  const exerciseTypes = [
    '20-20-20',
    'figure-eight',
    'near-far',
    'horizontal',
    'vertical',
    'palming'
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Generate Individual Exercise Assets</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-2">
        {exerciseTypes.map((type) => (
          <Button
            key={type}
            onClick={() => generateAsset(type)}
            disabled={isGenerating}
            className="relative w-full"
          >
            {isGenerating && currentBatch === type && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Generate {type} Asset
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExerciseAssetsGenerator;
