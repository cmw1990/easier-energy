import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Activity, Ban, Clock, Bell, Heart, Battery } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BlockingStats } from "@/components/distraction/BlockingStats";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { BlockingConfirmDialog } from "@/components/distraction/BlockingConfirmDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HealthConditionForm } from "@/components/health/HealthConditionForm";
import { TailoredRecommendations } from "@/components/health/TailoredRecommendations";
import { EnergyPatternAnalysis } from "@/components/health/EnergyPatternAnalysis";
import { FocusExercises } from "@/components/health/FocusExercises";
import { MoodOverview } from "@/components/MoodOverview";
import { useToast } from "@/hooks/use-toast";
import { ActivityTracker } from "@/components/health/ActivityTracker";
import { WeatherHealthInsights } from "@/components/health/WeatherHealthInsights";
import { GamesSection } from "@/components/games/GamesSection";
import { MeditationRecommendations } from "@/components/meditation/MeditationRecommendations";
import { DeskExercises } from "@/components/exercises/DeskExercises";
import { WalkingExercise } from "@/components/exercises/WalkingExercise";
import { RunningExercise } from "@/components/exercises/RunningExercise";
import { StretchExercise } from "@/components/exercises/StretchExercise";
import { DeskYoga } from "@/components/exercises/DeskYoga";
import { YogaPoses } from "@/components/exercises/YogaPoses";
import { ExerciseAssetsGenerator } from "@/components/exercises/ExerciseAssetsGenerator";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockingAction, setBlockingAction] = useState<"block" | "allow">("block");

  const { data: healthConditions, isLoading: isLoadingConditions } = useQuery({
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

  const { data: latestMood, isLoading: isLoadingMood, error: moodError } = useQuery({
    queryKey: ['latest-mood'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    meta: {
      onError: () => {
        toast({
          title: "Error loading mood data",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    }
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
      {!healthConditions && !isLoadingConditions && (
        <div className="mb-8">
          <HealthConditionForm />
        </div>
      )}

      {healthConditions && (
        <>
          <div className="mb-8">
            <ActivityTracker />
          </div>
          <div className="mb-8">
            <MoodOverview />
          </div>
          {healthConditions.weather_sensitive && (
            <div className="mb-8">
              <WeatherHealthInsights />
            </div>
          )}
          <div className="mb-8">
            <ExerciseAssetsGenerator />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <WalkingExercise />
            <RunningExercise />
            <DeskExercises />
          </div>
          <div className="mb-8">
            <StretchExercise />
          </div>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <DeskYoga />
            <YogaPoses />
          </div>
          <div className="mb-8">
            <MeditationRecommendations />
          </div>
          <div className="mb-8">
            <GamesSection />
          </div>
          <div className="mb-8">
            <TailoredRecommendations />
          </div>
          <div className="mb-8">
            <EnergyPatternAnalysis />
          </div>
          <div className="mb-8">
            <FocusExercises />
          </div>
        </>
      )}

      <Card className="p-6 bg-primary/5 border-2 border-primary/20 shadow-lg">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Focus Shield</h2>
            <p className="text-muted-foreground mb-6">
              Protect your productivity by blocking distractions with one click
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <Button
              size="lg"
              className="w-full text-lg py-6"
              onClick={() => handleBlockingAction("block")}
            >
              <Ban className="mr-2 h-6 w-6" />
              Block All
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full text-lg py-6"
              onClick={() => handleBlockingAction("allow")}
            >
              <Bell className="mr-2 h-6 w-6" />
              Allow All
            </Button>
          </div>
          <Button 
            variant="link" 
            className="text-lg"
            onClick={() => navigate('/distraction-blocker')}
          >
            Customize Blocking Settings →
          </Button>
        </div>
      </Card>

      <BlockingStats />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Activity className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Current State</h2>
            {isLoadingMood ? (
              <div className="w-full h-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
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
            )}
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/distraction-blocker')}>
          <div className="flex flex-col items-center space-y-4 text-center">
            <Clock className="h-10 w-10 text-primary" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Smart Blocking</h3>
              <p className="text-sm text-muted-foreground">
                Set up automated blocking schedules aligned with your energy patterns
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/distraction-blocker')}>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Ban className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Website Blocking</h3>
            <p className="text-sm text-muted-foreground">
              Block distracting websites
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/focus')}>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Brain className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Focus Mode</h3>
            <p className="text-sm text-muted-foreground">
              Deep work sessions with smart blocking
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/breathing')}>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Activity className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Take a Break</h3>
            <p className="text-sm text-muted-foreground">
              Guided breaks to maintain energy
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
