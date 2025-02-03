import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

const Breathing = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timer, setTimer] = useState(4);
  const [sessionCount, setSessionCount] = useState(0);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            switch (phase) {
              case "inhale":
                setPhase("hold");
                return 7;
              case "hold":
                setPhase("exhale");
                return 8;
              case "exhale":
                setPhase("inhale");
                setSessionCount(prev => prev + 1);
                return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const startExercise = () => {
    setIsActive(true);
    toast({
      title: "Breathing Exercise Started",
      description: "Follow the circle's rhythm for optimal results.",
    });
  };

  const stopExercise = async () => {
    setIsActive(false);
    setPhase("inhale");
    setTimer(4);

    if (session?.user && sessionCount > 0) {
      try {
        await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "4-7-8 Breathing",
          duration_minutes: Math.round((sessionCount * 19) / 60), // Each cycle is 19 seconds
          energy_rating: null,
          focus_rating: null,
          notes: `Completed ${sessionCount} breathing cycles`
        });

        toast({
          title: "Session Logged",
          description: `Completed ${sessionCount} breathing cycles. Great job!`,
        });
      } catch (error) {
        console.error("Error logging breathing session:", error);
      }
    }

    setSessionCount(0);
  };

  return (
    <div className="container max-w-2xl mx-auto space-y-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Breathing Exercise</h1>
        {sessionCount > 0 && (
          <div className="text-lg font-medium text-muted-foreground">
            Cycles: {sessionCount}
          </div>
        )}
      </div>
      
      <Card className="p-8 flex flex-col items-center space-y-6">
        <div 
          className={cn(
            "w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-primary flex items-center justify-center transition-all duration-1000",
            {
              "scale-110 border-primary": phase === "inhale",
              "scale-125 border-secondary": phase === "hold",
              "scale-100 border-primary": phase === "exhale",
            }
          )}
        >
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </div>
            <div className="text-4xl font-bold">{timer}s</div>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-4">
          {!isActive ? (
            <Button 
              onClick={startExercise} 
              className="w-full" 
              size="lg"
            >
              Start Exercise
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              onClick={stopExercise} 
              className="w-full"
              size="lg"
            >
              Stop
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground text-center space-y-1">
          <p className="font-medium">4-7-8 Breathing Technique</p>
          <p>Inhale for 4 seconds</p>
          <p>Hold for 7 seconds</p>
          <p>Exhale for 8 seconds</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Benefits</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Reduces anxiety and stress</li>
          <li>• Helps with sleep</li>
          <li>• Improves focus and concentration</li>
          <li>• Increases energy levels</li>
          <li>• Promotes mindfulness</li>
        </ul>
      </Card>
    </div>
  );
};

export default Breathing;