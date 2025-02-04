import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Heart, Focus, Sun, X, Image, 
  Moon, Leaf, Zap, Target, Sparkles, Waves 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { generateNatureSound } from "@/utils/audioGenerators";

const MEDITATION_TYPES = [
  { id: 'mindfulness', icon: Brain, label: 'Mindfulness' },
  { id: 'focus', icon: Target, label: 'Focus' },
  { id: 'energy', icon: Zap, label: 'Energy' },
  { id: 'stress-relief', icon: Leaf, label: 'Stress Relief' },
  { id: 'sleep', icon: Moon, label: 'Sleep' },
  { id: 'advanced', icon: Sparkles, label: 'Advanced' },
  { id: 'therapeutic', icon: Heart, label: 'Therapeutic' },
  { id: 'performance', icon: Waves, label: 'Performance' }
];

const Meditation = () => {
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);
  const [ambientSound, setAmbientSound] = useState<ReturnType<typeof generateNatureSound> | null>(null);

  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ['meditation-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const startSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('meditation_progress')
        .insert([{
          session_id: sessionId,
          user_id: user.id,
          completed_duration: 0,
          mood_before: null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, sessionId) => {
      const session = sessions?.find(s => s.id === sessionId);
      setActiveSession(sessionId);
      setBreathCount(0);
      setBreathPhase('inhale');
      
      // Start ambient sound
      if (ambientSound) ambientSound.stop();
      const sound = generateNatureSound('ocean', 0.3);
      setAmbientSound(sound);

      toast({
        title: "Session Started",
        description: `Starting ${session?.title}. Find a comfortable position and follow along.`,
      });
    },
    onError: (error) => {
      console.error('Meditation session error:', error);
      toast({
        title: "Error Starting Session",
        description: "Unable to start meditation session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateBackgroundMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await supabase.functions.invoke('generate-meditation-backgrounds', {
        body: { sessionId },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Background Generated",
        description: "New meditation background has been created.",
      });
      setGeneratingImageId(null);
    },
    onError: (error) => {
      console.error('Background generation error:', error);
      toast({
        title: "Error Generating Background",
        description: "Unable to generate meditation background. Please try again.",
        variant: "destructive",
      });
      setGeneratingImageId(null);
    },
  });

  const handleEndSession = () => {
    setActiveSession(null);
    setBreathCount(0);
    setBreathPhase('inhale');
    if (ambientSound) {
      ambientSound.stop();
      setAmbientSound(null);
    }
    toast({
      title: "Session Ended",
      description: "Your meditation session has ended. Great job!",
    });
  };

  const handleGenerateBackground = async (sessionId: string) => {
    if (!generatingImageId) {
      setGeneratingImageId(sessionId);
      try {
        await generateBackgroundMutation.mutateAsync(sessionId);
      } catch (error) {
        setGeneratingImageId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-primary/20 rounded-full" />
          <div className="space-y-3">
            <div className="h-4 w-28 bg-primary/20 rounded" />
            <div className="h-4 w-20 bg-primary/20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (activeSession) {
    const currentSession = sessions?.find(s => s.id === activeSession);
    const backgroundStyle = currentSession?.background_image_url ? {
      backgroundImage: `url(${currentSession.background_image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {};

    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center"
          style={backgroundStyle}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="max-w-2xl w-full mx-auto p-6 space-y-8 relative">
            <div className="flex justify-between items-center">
              <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-semibold text-white"
              >
                {currentSession?.title}
              </motion.h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEndSession}
                className="text-white hover:text-primary hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative aspect-square max-w-md mx-auto">
              <motion.div 
                className="absolute inset-0 bg-primary/10 rounded-full"
                animate={{
                  scale: breathPhase === 'inhale' ? [1, 1.5] : breathPhase === 'exhale' ? [1.5, 1] : 1.5,
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: breathPhase === 'hold' ? 0 : 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div 
                className="absolute inset-4 rounded-full border-4 border-primary/50 flex items-center justify-center backdrop-blur-lg"
                animate={{
                  scale: breathPhase === 'inhale' ? [1, 1.2] : breathPhase === 'exhale' ? [1.2, 1] : 1.2,
                  borderWidth: breathPhase === 'hold' ? 6 : 4,
                }}
                transition={{
                  duration: breathPhase === 'hold' ? 0 : 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <motion.span 
                  className="text-4xl font-light text-white"
                  animate={{ 
                    scale: [0.9, 1.1],
                    opacity: [0.8, 1] 
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  {breathCount}
                </motion.span>
              </motion.div>
            </div>
            <motion.p 
              className="text-center text-lg text-white/90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {breathPhase === 'inhale' ? 'Breathe in...' : 
               breathPhase === 'hold' ? 'Hold...' : 
               'Breathe out...'}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Brain className="h-8 w-8" />
          Meditation Space
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find peace and clarity through guided meditation sessions tailored to your needs.
        </p>
      </div>

      <Tabs defaultValue="mindfulness" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {MEDITATION_TYPES.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2">
              <type.icon className="h-4 w-4" />
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {MEDITATION_TYPES.map((type) => (
          <TabsContent key={type.id} value={type.id} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions?.filter(session => session.type === type.id).map((session) => (
                <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-muted aspect-video flex items-center justify-center relative">
                    {session.background_image_url ? (
                      <img 
                        src={session.background_image_url} 
                        alt={session.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <type.icon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{session.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{session.duration_minutes} minutes</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateBackground(session.id)}
                          disabled={generatingImageId === session.id}
                        >
                          {generatingImageId === session.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <Image className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => startSessionMutation.mutate(session.id)}
                          disabled={startSessionMutation.isPending || activeSession !== null}
                        >
                          {startSessionMutation.isPending && activeSession === session.id ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              Starting...
                            </>
                          ) : (
                            'Start Session'
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Meditation;