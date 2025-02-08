
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, TrendingUp } from "lucide-react";
import type { CycleSleepCorrelation } from "@/types/cycle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const CycleSleepCorrelation = () => {
  const { session } = useAuth();

  const { data: sleepCorrelations } = useQuery({
    queryKey: ['cycle_sleep_correlations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycle_sleep_correlations')
        .select('*')
        .order('date', { ascending: true })
        .limit(30);

      if (error) throw error;
      return data as CycleSleepCorrelation[];
    },
    enabled: !!session?.user?.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-purple-500" />
          Sleep & Cycle Correlation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sleepCorrelations?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sleepCorrelations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sleep_quality" 
                stroke="#8884d8" 
                name="Sleep Quality"
              />
              <Line 
                type="monotone" 
                dataKey="heart_rate_variability" 
                stroke="#82ca9d" 
                name="HRV"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No sleep correlation data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
