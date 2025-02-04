import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Heart, Play, Pause, History } from "lucide-react";
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import BreathingGame from "@/components/games/BreathingGame";
import BalloonJourney from "@/components/games/BalloonJourney";
import ZenGarden from "@/components/games/ZenGarden";
import { BreathingTechniques, type BreathingTechnique } from "@/components/breathing/BreathingTechniques";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Breathing = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const { toast } = useToast();
  const { session } = useAuth();
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [phaseSeconds, setPhaseSeconds] = useState(0);
  const hapticTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);

  const { data: recentSessions, refetch } = useQuery({
    queryKey: ["breathingSessions"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("energy_focus_logs")
          .select("*")
          .eq("user_id", session?.user?.id)
          .eq("activity_type", "breathing")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) {
          toast({
            title: "Error loading sessions",
            description: "Could not load your recent breathing sessions. Please try again.",
            variant: "destructive",
          });
          throw error;
        }
        return data;
      } catch (error) {
        console.error("Error fetching breathing sessions:", error);
        return [];
      }
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  const clearHapticTimeouts = () => {
    hapticTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    hapticTimeoutRef.current = [];
  };

  const scheduleHapticImpact = (style: ImpactStyle, delay: number) => {
    const timeout = setTimeout(async () => {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.warn('Haptic impact failed:', error);
      }
    }, delay);
    hapticTimeoutRef.current.push(timeout);
  };

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && selectedTechnique) {
      interval = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
        setPhaseSeconds((prev) => prev + 1);
        
        const { pattern } = selectedTechnique;
        const totalCycleLength = (pattern.inhale + (pattern.hold || 0) + pattern.exhale + (pattern.holdAfterExhale || 0));
        const currentPhase = Math.floor((seconds % totalCycleLength));
        
        let newPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
        if (currentPhase < pattern.inhale) {
          newPhase = 'inhale';
        } else if (pattern.hold && currentPhase < (pattern.inhale + pattern.hold)) {
          newPhase = 'hold';
        } else if (currentPhase < (pattern.inhale + (pattern.hold || 0) + pattern.exhale)) {
          newPhase = 'exhale';
        } else {
          newPhase = 'rest';
        }
        
        if (newPhase !== breathPhase) {
          setBreathPhase(newPhase);
          setPhaseSeconds(0);
          
          // Schedule haptic feedback based on the phase
          clearHapticTimeouts();
          switch (newPhase) {
            case 'inhale':
              for (let i = 0; i < 3; i++) {
                scheduleHapticImpact(ImpactStyle.Light, i * 200);
              }
              break;
            case 'hold':
              scheduleHapticImpact(ImpactStyle.Medium, 0);
              break;
            case 'exhale':
              for (let i = 0; i < 3; i++) {
                scheduleHapticImpact(ImpactStyle.Heavy, i * 200);
              }
              break;
            case 'rest':
              scheduleHapticImpact(ImpactStyle.Light, 0);
              break;
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      clearHapticTimeouts();
    };
  }, [isActive, seconds, breathPhase, selectedTechnique]);

  const handleStartStop = async () => {
    if (!selectedTechnique) {
      toast({
        title: "Please select a breathing technique",
        description: "Choose a breathing technique before starting the exercise",
        variant: "destructive",
      });
      return;
    }

    if (!isActive) {
      setIsActive(true);
      try {
        await Haptics.notification({ type: NotificationType.Success });
      } catch (error) {
        console.warn('Haptic notification failed:', error);
      }
    } else {
      setIsActive(false);
      clearHapticTimeouts();
      handleSaveSession();
    }
  };

  const handleSaveSession = async () => {
    try {
      const { error } = await supabase.from("energy_focus_logs").insert({
        user_id: session?.user?.id,
        activity_type: "breathing",
        activity_name: "Breathing Exercise",
        duration_minutes: Math.round(seconds / 60),
        focus_rating: 0,
        energy_rating: 0,
      });

      if (error) throw error;

      toast({
        title: "Session saved",
        description: `Breathing session of ${Math.round(seconds / 60)} minutes recorded`,
      });

      setSeconds(0);
      setBreathPhase('rest');
      setPhaseSeconds(0);
      refetch();
    } catch (error) {
      toast({
        title: "Error saving session",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getBreathPhaseText = () => {
    if (!selectedTechnique) return 'Select a technique';
    
    switch (breathPhase) {
      case 'inhale':
        return `Breathe In (${selectedTechnique.pattern.inhale}s)`;
      case 'hold':
        return `Hold (${selectedTechnique.pattern.hold}s)`;
      case 'exhale':
        return `Breathe Out (${selectedTechnique.pattern.exhale}s)`;
      default:
        return selectedTechnique.pattern.holdAfterExhale 
          ? `Rest (${selectedTechnique.pattern.holdAfterExhale}s)`
          : 'Get Ready';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Breathing Exercise</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a moment to breathe deeply and mindfully. Regular breathing exercises can help reduce stress and improve focus.
        </p>
      </div>

      <Tabs defaultValue="exercise" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TabsTrigger value="exercise">
            Guided Exercise
          </TabsTrigger>
          <TabsTrigger value="pufferfish">
            Puffer Fish Game
          </TabsTrigger>
          <TabsTrigger value="balloon">
            Balloon Journey
          </TabsTrigger>
          <TabsTrigger value="zen">
            Zen Garden
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercise" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <BreathingTechniques 
              onSelectTechnique={setSelectedTechnique}
              className="md:row-span-2"
            />
            
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-0" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center justify-between">
                  <span>Current Session</span>
                  <Heart className={`h-5 w-5 text-primary ${isActive ? 'animate-pulse' : ''}`} />
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-6xl font-bold text-primary transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {formatTime(seconds)}
                </div>
                {isActive && (
                  <div className="text-2xl font-semibold text-primary/80 animate-fade-in">
                    {getBreathPhaseText()}
                  </div>
                )}
                <Button
                  onClick={handleStartStop}
                  size="lg"
                  className={`w-40 h-40 rounded-full transition-transform duration-300 ${
                    isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
                  } ${isActive ? 'scale-95' : 'hover:scale-105'}`}
                >
                  {isActive ? (
                    <div className="flex flex-col items-center">
                      <Pause className="h-8 w-8 mb-2" />
                      <span>Stop</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Play className="h-8 w-8 mb-2" />
                      <span>Start</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSessions?.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {new Date(session.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{session.duration_minutes} minutes</TableCell>
                      </TableRow>
                    ))}
                    {(!recentSessions || recentSessions.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                          No recent sessions
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pufferfish">
          <BreathingGame />
        </TabsContent>

        <TabsContent value="balloon">
          <BalloonJourney />
        </TabsContent>

        <TabsContent value="zen">
          <ZenGarden />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Breathing;