import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Ban, Globe, Bell, Smartphone, Clock, Brain } from "lucide-react";
import { BlockingSchedule } from "@/components/distraction/BlockingSchedule";
import { WebsiteBlocker } from "@/components/distraction/WebsiteBlocker";
import { AppBlocker } from "@/components/distraction/AppBlocker";
import { BlockingStats } from "@/components/distraction/BlockingStats";
import { SmartBlockingRules } from "@/components/distraction/SmartBlockingRules";

const DistractionBlocker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    focusDuration: 0,
    distractionsBlocked: 0,
    productivityScore: 0
  });

  useEffect(() => {
    loadBlockingSettings();
    loadMetrics();
  }, [session?.user?.id]);

  const loadBlockingSettings = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('distraction_blocking')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      console.log('Loaded settings:', data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading blocking settings:', error);
      toast({
        title: "Error loading settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const loadMetrics = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('productivity_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setMetrics({
          focusDuration: data.focus_duration,
          distractionsBlocked: data.distractions_blocked,
          productivityScore: data.productivity_score
        });
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Ban className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Distraction Blocker</h1>
      </div>

      <BlockingStats />

      <div className="grid gap-6 md:grid-cols-2">
        <WebsiteBlocker />
        <AppBlocker />
      </div>

      <SmartBlockingRules />

      <BlockingSchedule />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Today's Focus Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label>Focus Duration</Label>
            <p className="text-2xl font-bold">{Math.round(metrics.focusDuration / 60)} hrs</p>
          </div>
          <div className="space-y-1">
            <Label>Distractions Blocked</Label>
            <p className="text-2xl font-bold">{metrics.distractionsBlocked}</p>
          </div>
          <div className="space-y-1">
            <Label>Productivity Score</Label>
            <p className="text-2xl font-bold">{metrics.productivityScore}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistractionBlocker;