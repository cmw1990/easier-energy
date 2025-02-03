import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Battery, Brain, Moon, AlarmClock, Calendar, Coffee, Activity, Info } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: recentLogs } = useQuery({
    queryKey: ["energyFocusLogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("energy_focus_logs")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: shiftData } = useQuery({
    queryKey: ["shiftSchedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quit_plans")
        .select("*")
        .eq("user_id", session?.user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const getAverageRating = (type: string, ratingField: "energy_rating" | "focus_rating") => {
    if (!recentLogs) return 0;
    const typeData = recentLogs.filter(log => log.activity_type === type);
    if (typeData.length === 0) return 0;
    const sum = typeData.reduce((acc, log) => acc + (log[ratingField] || 0), 0);
    return Math.round((sum / typeData.length) * 10) / 10;
  };

  const getLatestDuration = (type: string) => {
    if (!recentLogs) return 0;
    const typeData = recentLogs.find(log => log.activity_type === type);
    return typeData?.duration_minutes || 0;
  };

  const getLatestCaffeineIntake = () => {
    if (!recentLogs) return null;
    return recentLogs.find(log => log.activity_type === "caffeine");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {shiftData?.is_shift_worker && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Shift Work Energy Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIAssistant
              type="energy_pattern_analysis"
              data={{
                shiftPattern: shiftData?.shift_pattern,
                shiftStartTime: shiftData?.start_date,
                shiftEndTime: shiftData?.target_date,
                lastSleepScore: getAverageRating("sleep", "energy_rating"),
                caffeineIntake: getLatestCaffeineIntake(),
                energyLevel: getAverageRating("caffeine", "energy_rating"),
                focusScore: getAverageRating("focus", "focus_rating")
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative group cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/sleep")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Duration</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(getLatestDuration("sleep") / 60)} hours
            </div>
            <p className="text-xs text-muted-foreground">
              Latest sleep session
            </p>
          </CardContent>
        </Card>

        <Card className="relative group cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/sleep")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Alarm</CardTitle>
            <AlarmClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Set Alarm
            </div>
            <p className="text-xs text-muted-foreground">
              Configure your wake-up routine
            </p>
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="ghost" className="text-primary">
                Configure →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative group cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/focus")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAverageRating("focus", "focus_rating")}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Average focus rating
            </p>
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="ghost" className="text-primary">
                Improve Focus →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative group cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/caffeine")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Level</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAverageRating("caffeine", "energy_rating")}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Average energy rating
            </p>
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="ghost" className="text-primary">
                Track Energy →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Track your energy, focus, and sleep patterns</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs?.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium capitalize">{log.activity_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.activity_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {new Date(log.created_at).toLocaleDateString()}
                    </p>
                    {log.energy_rating && (
                      <p className="text-sm text-muted-foreground">
                        Energy: {log.energy_rating}/10
                      </p>
                    )}
                    {log.focus_rating && (
                      <p className="text-sm text-muted-foreground">
                        Focus: {log.focus_rating}/10
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {(!recentLogs || recentLogs.length === 0) && (
                <p className="text-center text-muted-foreground">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Energy Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIAssistant 
              type="daily_summary"
              data={{
                recentLogs,
                sleepDuration: getLatestDuration("sleep"),
                focusScore: getAverageRating("focus", "focus_rating"),
                energyLevel: getAverageRating("caffeine", "energy_rating"),
                isShiftWorker: shiftData?.is_shift_worker,
                shiftPattern: shiftData?.shift_pattern,
                caffeineIntake: getLatestCaffeineIntake()
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;