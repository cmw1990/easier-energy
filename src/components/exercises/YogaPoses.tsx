import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const YogaPoses = () => {
  const poses = [
    {
      title: "Mountain Pose (Tadasana)",
      description: "Stand tall with feet together, arms at sides",
      duration: "60 seconds",
      difficulty: "Easy",
      benefits: "Improves posture and balance",
    },
    {
      title: "Tree Pose (Vrksasana)",
      description: "Balance on one leg with other foot on inner thigh",
      duration: "30 seconds each side",
      difficulty: "Medium",
      benefits: "Enhances focus and balance",
    },
    {
      title: "Warrior I (Virabhadrasana I)",
      description: "Lunging pose with arms raised",
      duration: "45 seconds each side",
      difficulty: "Medium",
      benefits: "Strengthens legs and core",
    },
    {
      title: "Child's Pose (Balasana)",
      description: "Resting pose with knees wide, forehead on mat",
      duration: "60 seconds",
      difficulty: "Easy",
      benefits: "Calming and restorative",
    },
    {
      title: "Sun Salutation (Surya Namaskar)",
      description: "Flowing sequence of poses",
      duration: "5-10 minutes",
      difficulty: "Medium",
      benefits: "Full body warmup",
    },
    {
      title: "Corpse Pose (Savasana)",
      description: "Lying flat on back, completely relaxed",
      duration: "5 minutes",
      difficulty: "Easy",
      benefits: "Deep relaxation and stress relief",
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Traditional Yoga Poses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {poses.map((pose, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
            >
              <Activity className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{pose.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {pose.description}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-primary">{pose.duration}</p>
                  <span className="text-sm text-muted-foreground">
                    Difficulty: {pose.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Benefits: {pose.benefits}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};