import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Brain, Heart, Focus, Sun, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Meditation = () => {
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [breathCount, setBreathCount] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const { data: sessions, isLoading } = useQuery({
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
        .insert([
          {
            session_id: sessionId,
            user_id: user.id,
            completed_duration: 0,
            mood_before: null,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, sessionId) => {
      const session = sessions?.find(s => s.id === sessionId);
      setActiveSession(sessionId);
      setBreathCount(0);
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

  const generateImageMutation = useMutation({
    mutationFn: async () => {
      const currentSession = sessions?.find(s => s.id === activeSession);
      const response = await supabase.functions.invoke('generate-meditation-image', {
        body: {
          prompt: `Meditation scene for ${currentSession?.type || 'mindfulness'} meditation. ${currentSession?.title || 'Peaceful meditation scene'}`,
        },
      });

      if (response.error) throw response.error;
      return response.data.url;
    },
    onSuccess: (imageUrl) => {
      setBackgroundImage(imageUrl);
      toast({
        title: "Image Generated",
        description: "New meditation background has been created.",
      });
    },
    onError: (error) => {
      console.error('Image generation error:', error);
      toast({
        title: "Error Generating Image",
        description: "Unable to generate meditation background. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sessionTypes = [
    { id: 'mindfulness', icon: Brain, label: 'Mindfulness' },
    { id: 'loving-kindness', icon: Heart, label: 'Loving-Kindness' },
    { id: 'focus', icon: Focus, label: 'Focus' },
    { id: 'morning', icon: Sun, label: 'Morning' },
  ];

  const handleEndSession = () => {
    setActiveSession(null);
    setBreathCount(0);
    setBackgroundImage(null);
    toast({
      title: "Session Ended",
      description: "Your meditation session has ended. Great job!",
    });
  };

  const handleGenerateImage = () => {
    if (!isGeneratingImage) {
      setIsGeneratingImage(true);
      generateImageMutation.mutate(undefined, {
        onSettled: () => setIsGeneratingImage(false),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (activeSession) {
    const currentSession = sessions?.find(s => s.id === activeSession);
    const backgroundStyle = backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {};

    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="max-w-2xl w-full mx-auto p-6 space-y-8 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">{currentSession?.title}</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="text-white hover:text-primary hover:bg-white/10"
              >
                {isGeneratingImage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Image className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEndSession}
                className="text-white hover:text-primary hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative aspect-square max-w-md mx-auto bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <div className={`absolute inset-4 rounded-full border-4 border-primary transition-transform duration-4000 animate-breathe flex items-center justify-center`}>
              <span className="text-4xl font-light text-white">{breathCount}</span>
            </div>
          </div>
          <p className="text-center text-lg text-white/90">
            Focus on your breath. The circle expands on inhale, contracts on exhale.
          </p>
        </div>
      </div>
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
        <TabsList className="grid grid-cols-4 gap-4">
          {sessionTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2">
              <type.icon className="h-4 w-4" />
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sessionTypes.map((type) => (
          <TabsContent key={type.id} value={type.id} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions?.filter(session => session.type === type.id).map((session) => (
                <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-muted aspect-video flex items-center justify-center">
                    <type.icon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <CardTitle>{session.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{session.duration_minutes} minutes</span>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => startSessionMutation.mutate(session.id)}
                        disabled={startSessionMutation.isPending || activeSession !== null}
                      >
                        {startSessionMutation.isPending && activeSession === session.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          'Start Session'
                        )}
                      </Button>
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
