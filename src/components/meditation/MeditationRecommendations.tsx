import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Battery, Activity, Sun, Moon, Heart, Sparkles } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export const MeditationRecommendations = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: recommendations } = useQuery({
    queryKey: ['meditation-recommendations'],
    queryFn: async () => {
      // Get user's health conditions and latest mood
      const [conditionsResponse, moodResponse, progressResponse] = await Promise.all([
        supabase
          .from('user_health_conditions')
          .select('conditions, needs_energy_support, needs_focus_support')
          .eq('user_id', session?.user?.id)
          .maybeSingle(),
        supabase
          .from('mood_logs')
          .select('mood_score, energy_level, stress_level')
          .eq('user_id', session?.user?.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('meditation_progress')
          .select('created_at')
          .eq('user_id', session?.user?.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
      ]);

      // Get current hour to recommend appropriate sessions
      const currentHour = new Date().getHours();
      let recommendedTypes = ['mindfulness']; // Default type
      let intensity = 'medium'; // Default intensity

      // Adjust intensity based on user's energy level
      if (moodResponse.data?.energy_level) {
        if (moodResponse.data.energy_level <= 3) intensity = 'light';
        else if (moodResponse.data.energy_level >= 8) intensity = 'strong';
      }

      // Time-based recommendations
      if (currentHour >= 5 && currentHour < 11) {
        recommendedTypes = ['energy', 'focus'];
      } else if (currentHour >= 11 && currentHour < 17) {
        recommendedTypes = ['focus', 'stress-relief'];
      } else if (currentHour >= 17 && currentHour < 22) {
        recommendedTypes = ['stress-relief', 'sleep'];
      } else {
        recommendedTypes = ['sleep', 'mindfulness'];
      }

      // Personalization based on user needs
      if (conditionsResponse.data?.needs_energy_support) {
        recommendedTypes.push('energy');
      }
      if (conditionsResponse.data?.needs_focus_support) {
        recommendedTypes.push('focus');
      }

      // Stress-based adjustments
      if (moodResponse.data?.stress_level >= 7) {
        recommendedTypes.push('stress-relief');
        intensity = 'light'; // Lower intensity for stressed users
      }

      // Calculate streak
      let streak = 0;
      const sessions = progressResponse.data || [];
      let currentDate = new Date();
      
      for (const session of sessions) {
        const sessionDate = new Date(session.created_at).toDateString();
        if (sessionDate === currentDate.toDateString()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Get personalized sessions based on time and user needs
      const { data: timeOfDay } = await supabase
        .from('meditation_sessions')
        .select('*')
        .in('type', recommendedTypes)
        .eq('difficulty_level', intensity)
        .order('duration_minutes')
        .limit(3);

      return {
        personalizedSessions: timeOfDay || [],
        conditions: conditionsResponse.data?.conditions || [],
        streak,
        mood: moodResponse.data
      };
    },
    enabled: !!session?.user?.id,
  });

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'energy':
        return <Battery className="h-5 w-5 text-yellow-500" />;
      case 'focus':
        return <Brain className="h-5 w-5 text-blue-500" />;
      case 'stress-relief':
        return <Activity className="h-5 w-5 text-emerald-500" />;
      case 'sleep':
        return <Moon className="h-5 w-5 text-purple-500" />;
      case 'mindfulness':
        return <Sun className="h-5 w-5 text-orange-500" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  if (!recommendations?.personalizedSessions.length) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Recommended Meditations
          </CardTitle>
          {recommendations.streak > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>{recommendations.streak} day streak!</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.mood && (
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                <span className="text-sm">Mood: {recommendations.mood.mood_score}/10</span>
              </div>
              <Progress 
                value={recommendations.mood.energy_level * 10} 
                className="h-2 w-24"
              />
            </div>
          )}
          
          {recommendations.personalizedSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
              onClick={() => navigate('/meditation')}
            >
              {getSessionIcon(session.type)}
              <div>
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-sm text-muted-foreground">{session.description}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {session.duration_minutes} minutes
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/meditation')}
          >
            View All Sessions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};