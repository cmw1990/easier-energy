import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const OpenAITest = () => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);

  const testOpenAI = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'test-openai',
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (error) throw error;
      
      console.log('Test response:', data);
      
      toast({
        title: 'Success!',
        description: 'The OpenAI API key is working correctly!',
      });
    } catch (error) {
      console.error('Error testing OpenAI:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to test OpenAI connection',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Button 
      onClick={testOpenAI} 
      disabled={isTesting}
      className="gap-2"
    >
      {isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
      Test OpenAI Connection
    </Button>
  );
};