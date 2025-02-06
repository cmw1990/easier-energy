
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Timer, RotateCw, MoveHorizontal, MoveVertical, Maximize2, Minimize2 } from "lucide-react";
import { EyeExerciseTimer } from "@/components/exercises/EyeExerciseTimer";
import { EyeRelaxationGuide } from "@/components/exercises/EyeRelaxationGuide";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const EyeExercises = () => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const exercises = [
    {
      id: "20-20-20",
      title: "20-20-20 Rule",
      description: "Every 20 minutes, look at something 20 feet away for 20 seconds",
      icon: Eye,
      duration: 20,
    },
    {
      id: "figure-eight",
      title: "Figure Eight",
      description: "Move your eyes in a figure-eight pattern",
      icon: RotateCw,
      duration: 30,
    },
    {
      id: "near-far",
      title: "Near & Far Focus",
      description: "Alternate focusing between near and far objects",
      icon: Maximize2,
      duration: 60,
    },
    {
      id: "horizontal",
      title: "Horizontal Movement",
      description: "Move eyes slowly from left to right",
      icon: MoveHorizontal,
      duration: 30,
    },
    {
      id: "vertical",
      title: "Vertical Movement",
      description: "Move eyes slowly up and down",
      icon: MoveVertical,
      duration: 30,
    },
    {
      id: "palming",
      title: "Palming",
      description: "Cover your eyes with your palms and relax",
      icon: Minimize2,
      duration: 120,
    }
  ];

  const handleComplete = async (exerciseId: string) => {
    try {
      const { error } = await supabase
        .from('eye_exercise_logs')
        .insert({
          user_id: session?.user?.id,
          exercise_type: exerciseId,
          duration_seconds: exercises.find(e => e.id === exerciseId)?.duration || 0,
          notes: exerciseId
        });

      if (error) throw error;

      toast({
        title: "Exercise Completed!",
        description: "Your progress has been saved.",
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
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Eye Exercises & Relaxation</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <exercise.icon className="h-5 w-5 text-primary" />
                {exercise.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{exercise.description}</p>
              {activeExercise === exercise.id ? (
                <EyeExerciseTimer
                  duration={exercise.duration}
                  onComplete={() => handleComplete(exercise.id)}
                  onCancel={() => setActiveExercise(null)}
                />
              ) : (
                <Button 
                  onClick={() => setActiveExercise(exercise.id)}
                  className="w-full"
                >
                  Start Exercise
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <EyeRelaxationGuide />
    </div>
  );
};

export default EyeExercises;
