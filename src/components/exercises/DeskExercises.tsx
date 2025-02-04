import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Activity, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { AnimatedExerciseDisplay } from "./AnimatedExerciseDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const DeskExercises = () => {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const exercises = [
    {
      title: "Neck Rolls",
      description: "Gently roll your neck in circles, 5 times each direction",
      duration: "30 seconds",
      icon: Activity,
      type: "stretch",
      imageUrl: "/exercise-assets/neck-rolls.png"
    },
    {
      title: "Shoulder Stretches",
      description: "Roll shoulders backwards and forwards",
      duration: "30 seconds",
      icon: Activity,
      type: "stretch",
      imageUrl: "/exercise-assets/shoulder-stretches.png"
    },
    {
      title: "Wrist Exercises",
      description: "Rotate wrists and stretch fingers",
      duration: "30 seconds",
      icon: Dumbbell,
      type: "strength",
      imageUrl: "/exercise-assets/wrist-exercises.png"
    },
    {
      title: "Desk Stretches",
      description: "Stretch arms overhead and lean side to side",
      duration: "45 seconds",
      icon: Activity,
      type: "stretch",
      imageUrl: "/exercise-assets/desk-stretches.png"
    },
    {
      title: "Seated Leg Stretches",
      description: "Extend legs and point/flex feet",
      duration: "30 seconds",
      icon: Activity,
      type: "stretch",
      imageUrl: "/exercise-assets/seated-leg-stretches.png"
    },
    {
      title: "Back Twist",
      description: "Gentle seated spinal twist, both sides",
      duration: "45 seconds",
      icon: Activity,
      type: "stretch",
      imageUrl: "/exercise-assets/back-twist.png"
    }
  ];

  const startExercise = (index: number) => {
    setActiveExercise(index);
    setDuration(0);
    setDialogOpen(true);
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  };

  const completeExercise = async (index: number) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('exercise_tracking')
        .insert({
          user_id: session.user.id,
          exercise_type: 'desk_exercise',
          duration_seconds: duration,
          notes: exercises[index].title
        });

      if (error) throw error;

      toast({
        title: "Exercise Completed!",
        description: `You completed ${exercises[index].title} for ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
      });
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast({
        title: "Error saving exercise",
        description: "Please try again",
        variant: "destructive",
      });
    }

    setActiveExercise(null);
    setDuration(0);
    setDialogOpen(false);
  };

  return (
    <>
      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary animate-bounce" />
            Desk Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 transform ${
                  activeExercise === index 
                    ? "bg-primary/10 shadow-lg scale-105 animate-breathe" 
                    : "bg-muted/50 hover:bg-muted/70 hover:scale-[1.02]"
                }`}
              >
                <exercise.icon className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-medium">{exercise.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exercise.description}
                  </p>
                  <p className="text-sm text-primary mt-1">{exercise.duration}</p>
                  {activeExercise === index && (
                    <div className="mt-2 flex items-center gap-2 animate-fade-in">
                      <Timer className="h-4 w-4 animate-pulse" />
                      <span className="text-sm font-medium">
                        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant={activeExercise === index ? "destructive" : "default"}
                  onClick={() => startExercise(index)}
                  disabled={activeExercise !== null && activeExercise !== index}
                  className="transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                >
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {activeExercise !== null ? exercises[activeExercise].title : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {activeExercise !== null && (
              <>
                <div className="w-full aspect-square mb-4">
                  <AnimatedExerciseDisplay
                    imageUrl={exercises[activeExercise].imageUrl}
                    exerciseType={exercises[activeExercise].type}
                    isActive={true}
                    progress={(duration / 30) * 100} // Assuming 30 seconds is 100%
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 animate-pulse" />
                    <span className="text-sm font-medium">
                      {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={() => completeExercise(activeExercise)}
                  >
                    Complete
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};