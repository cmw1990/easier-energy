import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Activity } from "lucide-react";

export const DeskExercises = () => {
  const exercises = [
    {
      title: "Neck Rolls",
      description: "Gently roll your neck in circles, 5 times each direction",
      duration: "30 seconds",
      icon: Activity,
    },
    {
      title: "Shoulder Stretches",
      description: "Roll shoulders backwards and forwards",
      duration: "30 seconds",
      icon: Activity,
    },
    {
      title: "Wrist Exercises",
      description: "Rotate wrists and stretch fingers",
      duration: "30 seconds",
      icon: Dumbbell,
    },
    {
      title: "Desk Stretches",
      description: "Stretch arms overhead and lean side to side",
      duration: "45 seconds",
      icon: Activity,
    },
    {
      title: "Seated Leg Stretches",
      description: "Extend legs and point/flex feet",
      duration: "30 seconds",
      icon: Activity,
    },
    {
      title: "Back Twist",
      description: "Gentle seated spinal twist, both sides",
      duration: "45 seconds",
      icon: Activity,
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          Desk Exercises
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
            >
              <exercise.icon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{exercise.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {exercise.description}
                </p>
                <p className="text-sm text-primary mt-1">{exercise.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};