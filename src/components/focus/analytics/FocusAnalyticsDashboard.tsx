
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Target, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FocusMetrics {
  total_focus_time: number;
  successful_sessions: number;
  interrupted_sessions: number;
  peak_focus_periods: any[];
  productivity_score: number;
}

export const FocusAnalyticsDashboard = () => {
  const { data: analytics } = useQuery({
    queryKey: ['focus-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('focus_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      // Return default values if no data found
      return {
        total_focus_time: 0,
        successful_sessions: 0,
        interrupted_sessions: 0,
        peak_focus_periods: [],
        productivity_score: 0,
        ...data
      } as FocusMetrics;
    }
  });

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          Focus Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium">Focus Time</h3>
            </div>
            <p className="text-2xl font-bold">
              {Math.floor((analytics?.total_focus_time || 0) / 60)}h {(analytics?.total_focus_time || 0) % 60}m
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <h3 className="font-medium">Success Rate</h3>
            </div>
            <p className="text-2xl font-bold">
              {analytics?.successful_sessions && analytics?.interrupted_sessions ? 
                Math.round((analytics.successful_sessions / (analytics.successful_sessions + analytics.interrupted_sessions)) * 100) : 0}%
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <h3 className="font-medium">Productivity</h3>
            </div>
            <p className="text-2xl font-bold">
              {analytics?.productivity_score || 0}/100
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <h3 className="font-medium">Peak Hours</h3>
            </div>
            <p className="text-2xl font-bold">
              {analytics?.peak_focus_periods?.length || 0}
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
