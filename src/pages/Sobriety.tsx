import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Trophy, Activity, Users, Clock, Heart } from "lucide-react";

export default function Sobriety() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: quitAttempts } = useQuery({
    queryKey: ['quitAttempts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quit_attempts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: milestones } = useQuery({
    queryKey: ['milestones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recovery_milestones')
        .select('*')
        .order('achieved_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sobriety Journey</h1>
        <Button onClick={() => navigate('/sobriety/log')}>
          Log Substance Use
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Track Progress
            </CardTitle>
            <CardDescription>Log and monitor your substance use</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/sobriety/log')}
            >
              View Logs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Milestones
            </CardTitle>
            <CardDescription>Celebrate your achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/sobriety/recovery')}
            >
              View Milestones
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quit Plan
            </CardTitle>
            <CardDescription>Create and manage your quit plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/sobriety/quit-plan')}
            >
              View Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Support Network
            </CardTitle>
            <CardDescription>Connect with your support system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/sobriety/support')}
            >
              Get Support
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Tracker
            </CardTitle>
            <CardDescription>Track your sober time</CardDescription>
          </CardHeader>
          <CardContent>
            {quitAttempts?.[0] && (
              <div className="space-y-2">
                <Progress value={75} />
                <p className="text-sm text-muted-foreground">
                  Current streak: {
                    Math.floor(
                      (new Date().getTime() - new Date(quitAttempts[0].start_date).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )
                  } days
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Benefits
            </CardTitle>
            <CardDescription>Track your health improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {milestones?.map((milestone) => (
                <div key={milestone.id} className="text-sm">
                  {milestone.health_improvements?.[0]}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}