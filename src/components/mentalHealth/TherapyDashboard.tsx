
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Calendar, ClipboardCheck, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function TherapyDashboard() {
  const { session } = useAuth();

  const { data: upcomingSessions } = useQuery({
    queryKey: ['upcoming-sessions', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('consultation_sessions')
        .select(`
          *,
          mental_health_professionals (
            full_name,
            title
          )
        `)
        .eq('client_id', session?.user?.id)
        .gte('session_date', new Date().toISOString())
        .order('session_date')
        .limit(3);
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: prescribedRecipes } = useQuery({
    queryKey: ['prescribed-recipes', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('prescribed_charge_recipes')
        .select('*')
        .eq('client_id', session?.user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: progress } = useQuery({
    queryKey: ['mental-health-progress', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('mental_health_progress')
        .select('*')
        .eq('client_id', session?.user?.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();
      return data;
    },
    enabled: !!session?.user?.id
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.mood_score || '-'}/10</div>
            <Progress 
              value={((progress?.mood_score || 0) / 10) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Level</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.energy_level || '-'}/10</div>
            <Progress 
              value={((progress?.energy_level || 0) / 10) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.sleep_quality || '-'}/10</div>
            <Progress 
              value={((progress?.sleep_quality || 0) / 10) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Goals</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {progress?.exercise_completion && <div className="text-sm">✓ Exercise</div>}
              {progress?.meditation_completion && <div className="text-sm">✓ Meditation</div>}
              {progress?.nutrition_adherence && <div className="text-sm">✓ Nutrition</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions?.length ? (
              upcomingSessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {session.mental_health_professionals?.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.session_date).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Join
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming sessions</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Prescribed Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prescribedRecipes?.length ? (
              prescribedRecipes.map((recipe) => (
                <div key={recipe.id} className="space-y-2">
                  <h3 className="font-medium">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {recipe.description}
                  </p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No prescribed activities</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
