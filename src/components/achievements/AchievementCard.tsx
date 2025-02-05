import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AchievementBadge } from "./AchievementBadge";
import { Progress } from "@/components/ui/progress";

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  points: number;
  unlocked?: boolean;
}

export const AchievementCard = ({
  title,
  description,
  icon,
  progress,
  points,
  unlocked = false,
}: AchievementCardProps) => {
  return (
    <Card className={`transition-all duration-300 ${unlocked ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <AchievementBadge 
          icon={icon} 
          unlocked={unlocked}
          progress={progress}
        />
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progress}% Complete</span>
            <span>{points} Points</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};