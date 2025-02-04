import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Coins, Heart } from "lucide-react";

export default function Recovery() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const { data: milestones } = useQuery({
    queryKey: ['recovery-milestones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recovery_milestones')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('achieved_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: quitAttempt } = useQuery({
    queryKey: ['current-quit-attempt'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quit_attempts')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const daysSober = quitAttempt
    ? Math.floor((new Date().getTime() - new Date(quitAttempt.start_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recovery Progress</h1>
        <Button variant="outline" onClick={() => navigate('/sobriety')}>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{daysSober} days</div>
            <Progress value={(daysSober / 30) * 100} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {30 - (daysSober % 30)} days until next milestone
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {milestones?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Milestones reached in your journey
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones?.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  {milestone.milestone_type === 'financial' ? (
                    <Coins className="h-8 w-8 text-yellow-500" />
                  ) : (
                    <Heart className="h-8 w-8 text-rose-500" />
                  )}
                  <div>
                    <p className="font-medium">{milestone.milestone_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(milestone.achieved_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {milestone.money_saved && (
                  <p className="text-lg font-bold">
                    ${milestone.money_saved.toFixed(2)} saved
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}