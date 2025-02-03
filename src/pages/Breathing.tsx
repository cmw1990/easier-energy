import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Heart, Play, Pause, History } from "lucide-react";

const Breathing = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const { toast } = useToast();
  const { session } = useAuth();

  const { data: recentSessions, refetch } = useQuery({
    queryKey: ["breathingSessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("energy_focus_logs")
        .select("*")
        .eq("user_id", session?.user?.id)
        .eq("activity_type", "breathing")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleStartStop = () => {
    if (!isActive) {
      setIsActive(true);
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      // @ts-ignore - we know this is a number
      window.breathingInterval = interval;
    } else {
      setIsActive(false);
      // @ts-ignore - we know this exists
      clearInterval(window.breathingInterval);
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

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Breathing Exercise</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a moment to breathe deeply and mindfully. Regular breathing exercises can help reduce stress and improve focus.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-0" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center justify-between">
              <span>Current Session</span>
              <Heart className={`h-5 w-5 text-primary ${isActive ? 'animate-pulse' : ''}`} />
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-col items-center space-y-8 py-8">
              <div className={`text-6xl font-bold text-primary transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                {formatTime(seconds)}
              </div>
              <Button
                onClick={handleStartStop}
                size="lg"
                className={`w-40 h-40 rounded-full transition-transform duration-300 ${isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'} ${isActive ? 'scale-95' : 'hover:scale-105'}`}
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
            </div>
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
    </div>
  );
};

export default Breathing;