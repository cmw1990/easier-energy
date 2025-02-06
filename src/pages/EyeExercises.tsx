
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Timer, RotateCw, MoveHorizontal, MoveVertical, Maximize2, Minimize2 } from "lucide-react";
import { EyeExerciseTimer } from "@/components/exercises/EyeExerciseTimer";
import { EyeRelaxationGuide } from "@/components/exercises/EyeRelaxationGuide";
import { EyeExerciseStats } from "@/components/exercises/EyeExerciseStats";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const EyeExercises = () => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [completedExercise, setCompletedExercise] = useState<string | null>(null);
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
    setCompletedExercise(exerciseId);
    setShowRating(true);
    setActiveExercise(null);
  };

  const handleRatingSubmit = async () => {
    if (!completedExercise) return;

    try {
      const { error } = await supabase
        .from('eye_exercise_logs')
        .insert({
          user_id: session?.user?.id,
          exercise_type: completedExercise,
          duration_seconds: exercises.find(e => e.id === completedExercise)?.duration || 0,
          effectiveness_rating: rating,
          notes: completedExercise
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

    setShowRating(false);
    setCompletedExercise(null);
    setRating(0);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Eye Exercises & Relaxation</h1>
      
      <EyeExerciseStats />
      
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

      <Dialog open={showRating} onOpenChange={setShowRating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Exercise Effectiveness</DialogTitle>
            <DialogDescription>
              How effective was this exercise session?
            </DialogDescription>
          </DialogHeader>
          <RadioGroup value={rating.toString()} onValueChange={(value) => setRating(Number(value))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1">Not Effective</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">Slightly Effective</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3">Moderately Effective</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="r4" />
              <Label htmlFor="r4">Very Effective</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="r5" />
              <Label htmlFor="r5">Extremely Effective</Label>
            </div>
          </RadioGroup>
          <DialogFooter>
            <Button onClick={handleRatingSubmit}>Submit Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EyeRelaxationGuide />
    </div>
  );
};

export default EyeExercises;
