import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const StretchExercise = () => {
  const [activeStretch, setActiveStretch] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const { toast } = useToast();
  const { session } = useAuth();

  const stretches = [
    {
      title: "Standing Forward Bend",
      description: "Bend forward from the hips, keeping legs straight",
      duration: "30 seconds",
      difficulty: "Easy",
    },
    {
      title: "Cat-Cow Stretch",
      description: "Alternate between arching and rounding your back",
      duration: "45 seconds",
      difficulty: "Easy",
    },
    {
      title: "Downward Dog",
      description: "Form an inverted V-shape with your body",
      duration: "30 seconds",
      difficulty: "Medium",
    },
    {
      title: "Butterfly Stretch",
      description: "Seated with feet together, knees out",
      duration: "45 seconds",
      difficulty: "Easy",
    },
    {
      title: "Child's Pose",
      description: "Kneel and stretch arms forward on the ground",
      duration: "60 seconds",
      difficulty: "Easy",
    },
    {
      title: "Cobra Stretch",
      description: "Lie on stomach and lift chest while keeping hips down",
      duration: "30 seconds",
      difficulty: "Medium",
    }
  ];

  const startStretch = (index: number) => {
    setActiveStretch(index);
    setDuration(0);
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  };

  const completeStretch = async (index: number) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('exercise_tracking')
        .insert({
          user_id: session.user.id,
          exercise_type: 'stretch',
          duration_seconds: duration,
          notes: stretches[index].title
        });

      if (error) throw error;

      toast({
        title: "Stretch Completed!",
        description: `You completed ${stretches[index].title} for ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
      });
    } catch (error) {
      console.error('Error saving stretch:', error);
      toast({
        title: "Error saving stretch",
        description: "Please try again",
        variant: "destructive",
      });
    }

    setActiveStretch(null);
    setDuration(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Full Body Stretches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stretches.map((stretch, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
            >
              <Activity className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-medium">{stretch.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {stretch.description}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-primary">{stretch.duration}</p>
                  <span className="text-sm text-muted-foreground">
                    Difficulty: {stretch.difficulty}
                  </span>
                </div>
                {activeStretch === index && (
                  <div className="mt-2 flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant={activeStretch === index ? "destructive" : "default"}
                onClick={() => activeStretch === index ? completeStretch(index) : startStretch(index)}
                disabled={activeStretch !== null && activeStretch !== index}
              >
                {activeStretch === index ? "Complete" : "Start"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};