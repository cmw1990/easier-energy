
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Timer, RotateCw, MoveHorizontal, MoveVertical, Maximize2, Minimize2, AlertCircle } from "lucide-react";
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
import { AnimatedExerciseDisplay } from "@/components/exercises/AnimatedExerciseDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AnimationType = "svg" | "css";

interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: number;
  instructions: string[];
  animationType: AnimationType;
  visualGuideUrl?: string;
}

const EyeExercises = () => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [completedExercise, setCompletedExercise] = useState<string | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const exercises: Exercise[] = [
    {
      id: "20-20-20",
      title: "20-20-20 Rule",
      description: "Every 20 minutes, look at something 20 feet away for 20 seconds",
      icon: Eye,
      duration: 20,
      instructions: [
        "Find an object or point approximately 20 feet away",
        "Focus your gaze on that point",
        "Keep your head still and maintain focus",
        "Blink naturally throughout the exercise"
      ],
      animationType: "css",
      visualGuideUrl: "/assets/exercises/20-20-20.svg"
    },
    {
      id: "figure-eight",
      title: "Figure Eight",
      description: "Move your eyes in a figure-eight pattern",
      icon: RotateCw,
      duration: 30,
      instructions: [
        "Imagine a large figure 8 in front of you",
        "Trace the pattern slowly with your eyes",
        "Keep your head still while moving your eyes",
        "Switch direction halfway through"
      ],
      animationType: "svg",
      visualGuideUrl: "/assets/exercises/figure-eight.svg"
    },
    {
      id: "near-far",
      title: "Near & Far Focus",
      description: "Alternate focusing between near and far objects",
      icon: Maximize2,
      duration: 60,
      instructions: [
        "Hold your thumb about 10 inches from your face",
        "Focus on your thumb for 5 seconds",
        "Look at something 20 feet away for 5 seconds",
        "Repeat the cycle"
      ],
      animationType: "css",
      visualGuideUrl: "/assets/exercises/near-far.svg"
    },
    {
      id: "horizontal",
      title: "Horizontal Movement",
      description: "Move eyes slowly from left to right",
      icon: MoveHorizontal,
      duration: 30,
      instructions: [
        "Look as far left as comfortable",
        "Slowly move your gaze to the right",
        "Keep your head still",
        "Repeat the movement smoothly"
      ],
      animationType: "svg",
      visualGuideUrl: "/assets/exercises/horizontal.svg"
    },
    {
      id: "vertical",
      title: "Vertical Movement",
      description: "Move eyes slowly up and down",
      icon: MoveVertical,
      duration: 30,
      instructions: [
        "Look up as far as comfortable",
        "Slowly move your gaze downward",
        "Keep your head still",
        "Repeat the movement smoothly"
      ],
      animationType: "svg",
      visualGuideUrl: "/assets/exercises/vertical.svg"
    },
    {
      id: "palming",
      title: "Palming",
      description: "Cover your eyes with your palms and relax",
      icon: Minimize2,
      duration: 120,
      instructions: [
        "Rub your palms together to warm them",
        "Cup your palms over your closed eyes",
        "Ensure no light enters through gaps",
        "Focus on complete darkness and relaxation"
      ],
      animationType: "css",
      visualGuideUrl: "/assets/exercises/palming.svg"
    }
  ];

  const handleComplete = async (exerciseId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to track your exercises.",
        variant: "destructive",
      });
      return;
    }

    const exercise = exercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    setCompletedExercise(exerciseId);
    setShowRating(true);
    setActiveExercise(null);

    try {
      const { error } = await supabase
        .from('eye_exercise_logs')
        .insert({
          user_id: session.user.id,
          exercise_type: exerciseId,
          duration_seconds: exercise.duration,
          visual_guide_url: exercise.visualGuideUrl,
          notes: `Completed ${exercise.title}`
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error logging exercise:', error);
      toast({
        title: "Error saving exercise",
        description: "There was a problem saving your progress.",
        variant: "destructive",
      });
    }
  };

  const handleRatingSubmit = async () => {
    if (!completedExercise || !session?.user?.id) return;

    try {
      const exercise = exercises.find(e => e.id === completedExercise);
      
      const { error } = await supabase
        .from('eye_exercise_logs')
        .insert({
          user_id: session.user.id,
          exercise_type: completedExercise,
          duration_seconds: exercise?.duration || 0,
          effectiveness_rating: rating,
          visual_guide_url: exercise?.visualGuideUrl,
          notes: `Completed ${exercise?.title}`
        });

      if (error) throw error;

      toast({
        title: "Exercise Completed! 🎉",
        description: "Your progress has been saved and counts toward achievements.",
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
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Eye Exercises & Relaxation</h1>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Remember to blink regularly and stop any exercise if you feel discomfort.
            Take breaks between exercises and ensure proper lighting conditions.
          </AlertDescription>
        </Alert>
      </div>
      
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
                <div className="space-y-4">
                  <AnimatedExerciseDisplay
                    exerciseType={exercise.id}
                    imageUrl={exercise.visualGuideUrl}
                    animationType={exercise.animationType}
                    isActive={true}
                    progress={(exercise.duration - 0) / exercise.duration * 100}
                    instructions={exercise.instructions}
                  />
                  <EyeExerciseTimer
                    duration={exercise.duration}
                    onComplete={() => handleComplete(exercise.id)}
                    onCancel={() => setActiveExercise(null)}
                  />
                </div>
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
