import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Battery, Brain, Moon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const Dashboard = () => {
  const { session } = useAuth();

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
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

        <Card>
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
          </CardContent>
        </Card>

        <Card>
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
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
    </div>
  );
};

export default Dashboard;