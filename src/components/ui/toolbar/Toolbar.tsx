import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  Brain,
  Coffee,
  Moon,
  Sun,
  Wind,
  Check,
  X,
  Activity,
} from "lucide-react";

export function Toolbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const logSoberMoment = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your sobriety",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('substance_logs')
        .insert([{
          user_id: session.user.id,
          substance_type: 'none',
          quantity: 0,
          unit_of_measure: 'units',
          success_in_refusing: true,
          notes: 'Stayed sober - positive choice logged',
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your sober moment has been logged. Keep going!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log sober moment. Please try again.",
        variant: "destructive",
      });
      console.error("Error logging sober moment:", error);
    }
  };

  const startQuitAttempt = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start your quit journey",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('quit_attempts')
        .insert([{
          user_id: session.user.id,
          substance_type: 'general',
          challenges_faced: [],
          coping_strategies: [],
          support_received: [],
          notes: 'Starting fresh - committed to change',
        }]);

      if (error) throw error;

      toast({
        title: "Quit Journey Started",
        description: "Your commitment has been recorded. We're here to support you!",
      });
      
      // Navigate to the quit plan page for additional setup
      navigate('/sobriety/quit-plan');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start quit attempt. Please try again.",
        variant: "destructive",
      });
      console.error("Error starting quit attempt:", error);
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate("/focus")}
        >
          <Brain className="mr-2 h-4 w-4" />
          Focus Time
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate("/breathing")}
        >
          <Wind className="mr-2 h-4 w-4" />
          Breathing
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate("/sleep")}
        >
          <Moon className="mr-2 h-4 w-4" />
          Sleep
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate("/caffeine")}
        >
          <Coffee className="mr-2 h-4 w-4" />
          Caffeine
        </Button>

        <Button
          variant="outline"
          className="flex items-center"
          onClick={logSoberMoment}
        >
          <Check className="mr-2 h-4 w-4 text-green-500" />
          Sober Today
        </Button>

        <Button
          variant="outline"
          className="flex items-center"
          onClick={startQuitAttempt}
        >
          <X className="mr-2 h-4 w-4 text-red-500" />
          Start Quitting
        </Button>

        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate("/sobriety")}
        >
          <Activity className="mr-2 h-4 w-4" />
          Recovery Hub
        </Button>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}