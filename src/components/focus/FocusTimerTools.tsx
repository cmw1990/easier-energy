
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Timer, Pause, Play, RefreshCw, Clock, Brain } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundMusicPlayer } from "@/components/audio/BackgroundMusicPlayer";
import { useAuth } from "@/components/AuthProvider";

export const FocusTimerTools = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isBreak, setIsBreak] = useState(false);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);

  const startSession = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("No user ID");
      
      const { error } = await supabase
        .from('focus_timer_sessions')
        .insert({
          user_id: session.user.id,
          timer_type: 'pomodoro',
          work_duration: workDuration,
          break_duration: breakDuration,
          mood_before: moodBefore,
          energy_level: energyLevel,
          started_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Focus session started",
        description: "Your progress will be tracked automatically.",
      });
      setIsActive(true);
    },
  });

  const completeSession = useMutation({
    mutationFn: async (moodAfter: number) => {
      const { data: session } = await supabase
        .from('focus_timer_sessions')
        .select()
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (session) {
        const { error } = await supabase
          .from('focus_timer_sessions')
          .update({
            completed: true,
            mood_after: moodAfter,
            completed_at: new Date().toISOString(),
            actual_duration: workDuration * 60 - time
          })
          .eq('id', session.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus-analytics'] });
      toast({
        title: "Session completed!",
        description: "Great job staying focused!",
      });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (isBreak) {
        setTime(workDuration * 60);
        setIsBreak(false);
        toast({
          title: "Break finished!",
          description: "Time to focus again.",
        });
      } else {
        setTime(breakDuration * 60);
        setIsBreak(true);
        toast({
          title: "Time for a break!",
          description: `Take ${breakDuration} minutes to recharge.`,
        });
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak, workDuration, breakDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to use the focus timer.",
        variant: "destructive",
      });
      return;
    }

    if (!moodBefore || !energyLevel) {
      toast({
        title: "Please rate your state",
        description: "Set your mood and energy level before starting.",
        variant: "destructive",
      });
      return;
    }
    startSession.mutate();
  };

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-violet-500" />
          Focus Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold font-mono mb-2">{formatTime(time)}</div>
          <p className="text-sm text-muted-foreground">
            {isBreak ? "Break Time" : "Focus Time"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Work Duration (minutes)</Label>
            <Slider
              value={[workDuration]}
              onValueChange={(value) => setWorkDuration(value[0])}
              min={5}
              max={60}
              step={5}
              disabled={isActive}
            />
          </div>

          <div className="space-y-2">
            <Label>Break Duration (minutes)</Label>
            <Slider
              value={[breakDuration]}
              onValueChange={(value) => setBreakDuration(value[0])}
              min={1}
              max={15}
              step={1}
              disabled={isActive}
            />
          </div>

          {!isActive && (
            <>
              <div className="space-y-2">
                <Label>Current Mood (1-10)</Label>
                <Slider
                  value={moodBefore ? [moodBefore] : [5]}
                  onValueChange={(value) => setMoodBefore(value[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Energy Level (1-10)</Label>
                <Slider
                  value={energyLevel ? [energyLevel] : [5]}
                  onValueChange={(value) => setEnergyLevel(value[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center gap-4">
          {!isActive ? (
            <Button onClick={handleStart} className="w-32">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => setIsActive(false)} 
                variant="outline" 
                className="w-32"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button 
                onClick={() => {
                  setIsActive(false);
                  completeSession.mutate(7);
                }} 
                variant="destructive"
                className="w-32"
              >
                <Clock className="h-4 w-4 mr-2" />
                End
              </Button>
            </>
          )}
        </div>

        <BackgroundMusicPlayer />
      </CardContent>
    </Card>
  );
};

