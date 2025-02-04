import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const StretchExercise = () => {
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
              <div>
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};