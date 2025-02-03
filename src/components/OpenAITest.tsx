import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const OpenAITest = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const testOpenAI = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-openai');
      
      if (error) throw error;
      
      console.log('OpenAI Test Response:', data);
      
      toast({
        title: data.status === 'success' ? 'Success!' : 'Error',
        description: data.message,
        variant: data.status === 'success' ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error testing OpenAI:', error);
      toast({
        title: 'Error',
        description: 'Failed to test OpenAI API. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={testOpenAI} 
      disabled={isLoading}
    >
      {isLoading ? 'Testing...' : 'Test OpenAI Connection'}
    </Button>
  );
};