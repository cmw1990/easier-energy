import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Activity, Ban, Clock, Bell, BellOff, Heart, Battery, Focus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BlockingStats } from "@/components/distraction/BlockingStats";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { BlockingConfirmDialog } from "@/components/distraction/BlockingConfirmDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockingAction, setBlockingAction] = useState<"block" | "allow">("block");

  const { data: latestMood } = useQuery({
    queryKey: ['latest-mood'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleBlockingAction = (action: "block" | "allow") => {
    setBlockingAction(action);
    setDialogOpen(true);
  };

  if (!session) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Take Control of Your Focus
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          Sign in to start managing your distractions and boost productivity.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Focus Control Center</h1>
        <p className="text-lg text-muted-foreground">
          Your all-in-one dashboard for managing distractions and optimizing focus
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition-colors">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Ban className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Quick Block</h2>
            <p className="text-muted-foreground">
              Instantly block distractions based on your current energy and focus levels
            </p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={() => handleBlockingAction("block")}
              >
                <BellOff className="mr-2 h-5 w-5" />
                Block All
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => handleBlockingAction("allow")}
              >
                <Bell className="mr-2 h-5 w-5" />
                Allow All
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Activity className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Current State</h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  <span className="text-sm font-medium">Mood</span>
                </div>
                <p className="text-2xl font-bold">{latestMood?.mood_score || '-'}/10</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Battery className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Energy</span>
                </div>
                <p className="text-2xl font-bold">{latestMood?.energy_level || '-'}/10</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/distraction-blocker')}
            >
              <Shield className="mr-2 h-5 w-5" />
              Customize Blocking
            </Button>
          </div>
        </Card>
      </div>

      <BlockingStats />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/distraction-blocker')}>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Clock className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Schedule Blocking</h3>
            <p className="text-sm text-muted-foreground">
              Set up automated blocking schedules aligned with your energy patterns
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/focus')}>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Brain className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Focus Mode</h3>
            <p className="text-sm text-muted-foreground">
              Deep work sessions with smart distraction blocking
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/breathing')}>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Activity className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Take a Break</h3>
            <p className="text-sm text-muted-foreground">
              Guided breaks to maintain optimal energy levels
            </p>
          </div>
        </Card>
      </div>

      <BlockingConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={blockingAction}
      />
    </div>
  );
};

export default Index;