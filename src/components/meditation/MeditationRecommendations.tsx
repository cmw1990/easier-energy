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
      const { data: conditions } = await supabase
        .from('user_health_conditions')
        .select('conditions')
        .eq('user_id', session?.user?.id)
        .maybeSingle();

      const { data: timeOfDay } = await supabase
        .from('meditation_sessions')
        .select('*')
        .in('type', ['energy', 'focus', 'stress-relief'])
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
      default:
        return <Clock className="h-5 w-5 text-primary" />;
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