import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Test = () => {
  const { toast } = useToast();

  const testConnections = async () => {
    try {
      // Test Supabase connection
      const { data, error } = await supabase.from('user_settings').select('count').limit(1);
      
      if (error) throw error;
      
      toast({
        title: "Connection Test Successful",
        description: "Successfully connected to Supabase database!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : "Failed to connect to database",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Connections</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          <Button onClick={testConnections} className="w-full">
            Test Supabase Connection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Test;
