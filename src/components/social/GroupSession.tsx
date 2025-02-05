import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Users, Clock, Calendar, UserPlus, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface Participant {
  user_id: string;
  status: string;
  joined_at: string;
}

export const GroupSession = () => {
  const [sessions, setSessions] = useState<GroupSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Record<string, Participant[]>>({});
  const { toast } = useToast();
  const { session: authSession } = useAuth();

  useEffect(() => {
    fetchSessions();
    if (authSession?.user) {
      subscribeToPresence();
    }
  }, [authSession?.user]);

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

      // Fetch participants for each session
      data?.forEach(async (session) => {
        const { data: participantsData } = await supabase
          .from('session_participants')
          .select('*')
          .eq('session_id', session.id);
        
        setParticipants(prev => ({
          ...prev,
          [session.id]: participantsData || []
        }));
      });
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

  const subscribeToPresence = () => {
    sessions.forEach(session => {
      const channel = supabase.channel(`session:${session.id}`);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('Presence state:', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
          fetchParticipants(session.id);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
          fetchParticipants(session.id);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: authSession?.user?.id,
              online_at: new Date().toISOString(),
            });
          }
        });
    });
  };

  const fetchParticipants = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId);

    if (!error) {
      setParticipants(prev => ({
        ...prev,
        [sessionId]: data || []
      }));
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

      fetchParticipants(sessionId);
    } catch (error) {
      console.error('Error joining session:', error);
      toast({
        title: "Error joining session",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const isUserJoined = (sessionId: string) => {
    return participants[sessionId]?.some(p => p.user_id === authSession?.user?.id);
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
        <AnimatePresence>
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <p className="text-center text-muted-foreground">No upcoming sessions found</p>
            ) : (
              sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                        {participants[session.id]?.length || 0}/{session.max_participants}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => joinSession(session.id)}
                    className="mt-4 md:mt-0"
                    disabled={isUserJoined(session.id)}
                  >
                    {isUserJoined(session.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Joined
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Session
                      </>
                    )}
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};