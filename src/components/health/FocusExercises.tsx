import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Focus, Gamepad } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FocusExercises = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: healthConditions } = useQuery({
    queryKey: ['health-conditions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_health_conditions')
        .select('*')
        .eq('user_id', session?.user?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (!healthConditions?.needs_focus_support) return null;

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Focus className="h-5 w-5 text-primary" />
          Focus Exercises
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Card 
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate('/focus')}
          >
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Attention Training</h3>
                <p className="text-sm text-muted-foreground">
                  Exercises designed for ADHD and focus challenges
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate('/breathing')}
          >
            <div className="flex items-center gap-3">
              <Gamepad className="h-8 w-8 text-rose-500" />
              <div>
                <h3 className="font-semibold">Energy Management</h3>
                <p className="text-sm text-muted-foreground">
                  Games for fatigue and energy regulation
                </p>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};