import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Heart, Play, Pause } from "lucide-react";

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
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Breathing Exercise</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Session</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 py-6">
              <div className="text-4xl font-bold">{formatTime(seconds)}</div>
              <Button
                onClick={handleStartStop}
                size="lg"
                className="w-32"
              >
                {isActive ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
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
                    <TableCell colSpan={2} className="text-center">
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