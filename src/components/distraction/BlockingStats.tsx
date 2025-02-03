import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Ban, Clock, Shield, Activity } from "lucide-react";

export const BlockingStats = () => {
  const { session } = useAuth();
  const [stats, setStats] = useState({
    totalBlocked: 0,
    todayBlocked: 0,
    activeRules: 0,
    focusTime: 0,
    productivityScore: 0,
    streakDays: 0
  });

  useEffect(() => {
    loadStats();
  }, [session?.user?.id]);

  const loadStats = async () => {
    if (!session?.user?.id) return;

    try {
      // Get total blocked attempts
      const { count: totalBlocked } = await supabase
        .from('distraction_block_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

      // Get today's blocked attempts
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayBlocked } = await supabase
        .from('distraction_block_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id)
        .gte('blocked_at', today.toISOString());

      // Get active blocking rules
      const { count: activeRules } = await supabase
        .from('distraction_blocking')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      // Get today's productivity metrics
      const { data: metrics } = await supabase
        .from('productivity_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', today.toISOString().split('T')[0])
        .maybeSingle();

      // Calculate streak days
      const { data: streakData } = await supabase
        .from('productivity_metrics')
        .select('date')
        .eq('user_id', session.user.id)
        .gte('productivity_score', 70)
        .order('date', { ascending: false });

      let streakDays = 0;
      if (streakData) {
        const dates = streakData.map(d => new Date(d.date).getTime());
        let currentDate = new Date().getTime();
        
        for (let date of dates) {
          if (Math.abs(currentDate - date) <= 86400000 * (streakDays + 1)) {
            streakDays++;
            currentDate = date;
          } else {
            break;
          }
        }
      }

      setStats({
        totalBlocked: totalBlocked || 0,
        todayBlocked: todayBlocked || 0,
        activeRules: activeRules || 0,
        focusTime: metrics?.focus_duration || 0,
        productivityScore: metrics?.productivity_score || 0,
        streakDays
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Blocked</CardTitle>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBlocked}</div>
          <p className="text-xs text-muted-foreground">
            Distractions prevented
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Blocks</CardTitle>
          <Ban className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayBlocked}</div>
          <p className="text-xs text-muted-foreground">
            Blocks in the last 24h
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(stats.focusTime / 60)}h</div>
          <p className="text-xs text-muted-foreground">
            Productive hours today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productivity Streak</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.streakDays} days</div>
          <p className="text-xs text-muted-foreground">
            Consecutive productive days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};