import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const DeskYoga = () => {
  const poses = [
    {
      title: "Chair Pigeon",
      description: "Cross one ankle over opposite knee while seated",
      duration: "30 seconds each side",
      difficulty: "Easy",
    },
    {
      title: "Seated Cat-Cow",
      description: "Arch and round spine while seated",
      duration: "45 seconds",
      difficulty: "Easy",
    },
    {
      title: "Office Chair Twist",
      description: "Gentle seated spinal twist using chair for support",
      duration: "30 seconds each side",
      difficulty: "Easy",
    },
    {
      title: "Desk Plank",
      description: "Modified plank using desk for support",
      duration: "20 seconds",
      difficulty: "Medium",
    },
    {
      title: "Seated Eagle Arms",
      description: "Cross arms and lift elbows for shoulder stretch",
      duration: "30 seconds each side",
      difficulty: "Easy",
    },
    {
      title: "Chair Sun Salutation",
      description: "Modified sun salutation sequence while seated",
      duration: "60 seconds",
      difficulty: "Medium",
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Desk Yoga Poses
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};