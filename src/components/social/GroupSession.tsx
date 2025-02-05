import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Users, Clock, Calendar } from "lucide-react";

interface GroupSession {
  id: string;
  title: string;
  description: string;
  session_date: string;
  duration_minutes: number;
  max_participants: number;
  session_type: string;
  host_id: string;
  is_private: boolean;
  meeting_link?: string;
}

export const GroupSession = () => {
  const [sessions, setSessions] = useState<GroupSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { session: authSession } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('support_sessions')
        .select('*')
        .eq('is_private', false)
        .gte('session_date', new Date().toISOString())
        .order('session_date', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error loading sessions",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (sessionId: string) => {
    if (!authSession?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join a session",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          user_id: authSession.user.id,
          status: 'joined'
        });

      if (error) throw error;

      toast({
        title: "Successfully joined!",
        description: "You have joined the session",
      });

      // Trigger achievement
      await supabase
        .from('achievement_progress')
        .insert({
          user_id: authSession.user.id,
          achievement_id: 'first-group-session',
          current_progress: 1
        });

    } catch (error) {
      console.error('Error joining session:', error);
      toast({
        title: "Error joining session",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle>Loading sessions...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Upcoming Group Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-center text-muted-foreground">No upcoming sessions found</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">{session.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(session.session_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.duration_minutes} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {session.max_participants} max
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => joinSession(session.id)}
                  className="mt-4 md:mt-0"
                >
                  Join Session
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};