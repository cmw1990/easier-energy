import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Battery, Brain, Coffee, Dumbbell, HeartPulse, Moon, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Toolbar() {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSoberMoment = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to track your sober moments",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("substance_logs").insert([
        {
          user_id: session.user.id,
          substance_type: "other", // Using valid enum value
          quantity: 0,
          unit_of_measure: "instance",
          success_in_refusing: true,
          notes: "Logged a sober moment",
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your sober moment has been logged",
      });
    } catch (error) {
      console.error("Error logging sober moment:", error);
      toast({
        title: "Error",
        description: "Failed to log sober moment",
        variant: "destructive",
      });
    }
  };

  const handleStartQuitting = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start your quit journey",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("quit_attempts").insert([
        {
          user_id: session.user.id,
          substance_type: "other", // Using valid enum value
          challenges_faced: [], // Initialize as empty array
          coping_strategies: [], // Initialize as empty array
          support_received: [], // Initialize as empty array
          notes: "Started quit journey",
        },
      ]);

      if (error) throw error;

      toast({
        title: "Journey Started!",
        description: "Your quit journey has begun",
      });
      
      navigate("/quit-plan");
    } catch (error) {
      console.error("Error starting quit journey:", error);
      toast({
        title: "Error",
        description: "Failed to start quit journey",
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={() => navigate("/energy")}
        >
          <Battery className="h-5 w-5 text-emerald-500" />
          <span>Energy</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={() => navigate("/focus")}
        >
          <Brain className="h-5 w-5 text-blue-500" />
          <span>Focus</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={() => navigate("/exercise")}
        >
          <Dumbbell className="h-5 w-5 text-red-500" />
          <span>Exercise</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={() => navigate("/sleep")}
        >
          <Moon className="h-5 w-5 text-purple-500" />
          <span>Sleep</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={() => navigate("/caffeine")}
        >
          <Coffee className="h-5 w-5 text-yellow-500" />
          <span>Caffeine</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={handleSoberMoment}
        >
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span>Sober Today</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={handleStartQuitting}
        >
          <HeartPulse className="h-5 w-5 text-pink-500" />
          <span>Start Quitting</span>
        </Button>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}