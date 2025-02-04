import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Battery, Activity } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const MeditationRecommendations = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: recommendations } = useQuery({
    queryKey: ['meditation-recommendations'],
    queryFn: async () => {
      // Get user's health conditions
      const { data: conditions } = await supabase
        .from('user_health_conditions')
        .select('conditions, needs_energy_support, needs_focus_support')
        .eq('user_id', session?.user?.id)
        .maybeSingle();

      // Get current hour to recommend appropriate sessions
      const currentHour = new Date().getHours();
      let recommendedTypes = ['mindfulness']; // Default type

      // Morning (5-11): Energy and Focus
      if (currentHour >= 5 && currentHour < 11) {
        recommendedTypes = ['energy', 'focus'];
      }
      // Afternoon (11-17): Focus and Stress-relief
      else if (currentHour >= 11 && currentHour < 17) {
        recommendedTypes = ['focus', 'stress-relief'];
      }
      // Evening (17-22): Stress-relief and Sleep
      else if (currentHour >= 17 && currentHour < 22) {
        recommendedTypes = ['stress-relief', 'sleep'];
      }
      // Night (22-5): Sleep and Mindfulness
      else {
        recommendedTypes = ['sleep', 'mindfulness'];
      }

      // If user needs energy support, always include energy sessions
      if (conditions?.needs_energy_support) {
        recommendedTypes.push('energy');
      }

      // If user needs focus support, always include focus sessions
      if (conditions?.needs_focus_support) {
        recommendedTypes.push('focus');
      }

      // Get personalized sessions based on time and user needs
      const { data: timeOfDay } = await supabase
        .from('meditation_sessions')
        .select('*')
        .in('type', recommendedTypes)
        .order('duration_minutes')
        .limit(3);

      return {
        personalizedSessions: timeOfDay || [],
        conditions: conditions?.conditions || []
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
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  if (!recommendations?.personalizedSessions.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Recommended Meditations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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