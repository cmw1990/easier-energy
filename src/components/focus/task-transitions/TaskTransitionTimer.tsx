
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { MoveRight, Brain, Timer } from "lucide-react";

interface TransitionSettings {
  preparation_time: number;
  audio_cues: boolean;
  visual_reminders: boolean;
}

export const TaskTransitionTimer = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [settings, setSettings] = useState<TransitionSettings>({
    preparation_time: 2,
    audio_cues: true,
    visual_reminders: true
  });

  useEffect(() => {
    if (isTransitioning && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTransitioning(false);
            clearInterval(timer);
            notifyTransitionComplete();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTransitioning, timeRemaining]);

  const startTransition = async () => {
    try {
      const transitionData = {
        user_id: session?.user.id,
        transition_duration: settings.preparation_time * 60,
        strategies_used: ["timer", "mindful_transition"],
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('task_transitions')
        .insert(transitionData);

      if (error) throw error;

      setTimeRemaining(settings.preparation_time * 60);
      setIsTransitioning(true);
      
      toast({
        title: "Transition started",
        description: "Take a moment to prepare for your next task",
      });
    } catch (error) {
      console.error('Error starting transition:', error);
      toast({
        title: "Error starting transition",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const notifyTransitionComplete = () => {
    if (settings.audio_cues) {
      // Play completion sound
      const audio = new Audio("/notification-sound.mp3");
      audio.play().catch(console.error);
    }

    toast({
      title: "Transition complete!",
      description: "You're ready to start your next task.",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MoveRight className="h-5 w-5 text-teal-500" />
          Task Transition Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isTransitioning ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preparation Time (minutes)</Label>
              <Slider
                value={[settings.preparation_time]}
                onValueChange={(value) => 
                  setSettings({ ...settings, preparation_time: value[0] })}
                min={1}
                max={10}
                step={1}
              />
              <span className="text-sm text-muted-foreground">
                {settings.preparation_time} minutes
              </span>
            </div>

            <Button 
              onClick={startTransition}
              className="w-full"
              variant="default"
            >
              <Brain className="h-4 w-4 mr-2" />
              Start Transition
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-3xl font-bold font-mono">
              {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-sm text-muted-foreground">
              Take a deep breath and prepare for your next task
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setIsTransitioning(false)}
              >
                <Timer className="h-4 w-4 mr-2" />
                Skip Transition
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 rounded-lg bg-teal-100/50 dark:bg-teal-900/20 space-y-2">
          <h3 className="font-semibold">Transition Tips</h3>
          <ul className="space-y-1 text-sm">
            <li>• Clear your workspace from previous task items</li>
            <li>• Take a few deep breaths</li>
            <li>• Review your next task's objectives</li>
            <li>• Adjust your environment if needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
