
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Target, Medal, ArrowUp } from "lucide-react";

interface GamificationData {
  id: string;
  points_earned: number;
  streak_count: number;
  level: number;
  achievements: Achievement[];
  daily_challenges: Challenge[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export const FocusGamificationCard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadGamificationData();
    }
  }, [session?.user]);

  const loadGamificationData = async () => {
    try {
      const { data, error } = await supabase
        .from('focus_gamification')
        .select('*')
        .eq('user_id', session?.user.id)
        .single();

      if (error) throw error;
      
      setGamificationData(data);
    } catch (error) {
      console.error('Error loading gamification data:', error);
      toast({
        title: "Error loading gamification data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 100;
  };

  const getProgressToNextLevel = () => {
    if (!gamificationData) return 0;
    const nextLevelPoints = getNextLevelPoints(gamificationData.level);
    return (gamificationData.points_earned % nextLevelPoints) / nextLevelPoints * 100;
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Focus Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : gamificationData ? (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">Level {gamificationData.level}</p>
                <p className="text-sm text-muted-foreground">
                  {gamificationData.points_earned} total points
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">{gamificationData.streak_count} day streak!</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {gamificationData.level + 1}</span>
                <span>{Math.round(getProgressToNextLevel())}%</span>
              </div>
              <Progress value={getProgressToNextLevel()} className="h-2" />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Daily Challenges</h3>
              {gamificationData.daily_challenges?.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{challenge.title}</p>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+{challenge.points} pts</span>
                    <Button
                      variant={challenge.completed ? "ghost" : "outline"}
                      size="sm"
                      disabled={challenge.completed}
                    >
                      {challenge.completed ? "Completed" : "Complete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Recent Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                {gamificationData.achievements?.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg ${
                      achievement.unlocked
                        ? "bg-primary/10"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {achievement.icon === 'medal' ? (
                        <Medal className={`h-5 w-5 ${
                          achievement.unlocked ? "text-primary" : "text-muted-foreground"
                        }`} />
                      ) : (
                        <Trophy className={`h-5 w-5 ${
                          achievement.unlocked ? "text-primary" : "text-muted-foreground"
                        }`} />
                      )}
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No gamification data available</p>
            <Button>Start Your Journey</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
