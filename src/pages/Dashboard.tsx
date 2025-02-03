import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Battery, TrendingUp, Clock, Brain } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const { toast } = useToast();
  const [currentEnergyLevel, setCurrentEnergyLevel] = useState<number | null>(null);

  // Fetch energy logs
  const { data: energyLogs, isLoading } = useQuery({
    queryKey: ['energy-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('energy_focus_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) throw error;
      return data;
    }
  });

  const logEnergyLevel = async (level: number) => {
    try {
      const { error } = await supabase
        .from('energy_focus_logs')
        .insert([
          {
            activity_type: 'energy_rating',
            activity_name: 'daily_check',
            energy_rating: level,
          }
        ]);

      if (error) throw error;

      setCurrentEnergyLevel(level);
      toast({
        title: "Energy level logged",
        description: "Your energy level has been recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log energy level. Please try again.",
        variant: "destructive",
      });
    }
  };

  const chartData = energyLogs?.map(log => ({
    date: new Date(log.created_at).toLocaleDateString(),
    energy: log.energy_rating
  })).reverse();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Energy</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentEnergyLevel ? `${currentEnergyLevel}/10` : 'Not logged'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Energy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {energyLogs?.length ? 
                (energyLogs.reduce((acc, log) => acc + (log.energy_rating || 0), 0) / energyLogs.length).toFixed(1) 
                : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {energyLogs?.reduce((acc, log) => acc + (log.duration_minutes || 0), 0)} min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {energyLogs?.length ? 
                (energyLogs.reduce((acc, log) => acc + (log.focus_rating || 0), 0) / energyLogs.length).toFixed(1) 
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Energy Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#ee9ca7" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No energy data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log Current Energy Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <Button
                key={level}
                variant={currentEnergyLevel === level ? "default" : "outline"}
                className="h-12 w-12"
                onClick={() => logEnergyLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;