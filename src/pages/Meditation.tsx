import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Brain, Heart, Focus, Sun } from "lucide-react";

const Meditation = () => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
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

  const handleGenerateImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-meditation-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate image');

      const data = await response.json();
      toast({
        title: "Image generated successfully",
        description: "Your meditation background has been updated.",
      });

      // Update the session with the new image URL
      if (selectedSession) {
        const { error } = await supabase
          .from('meditation_sessions')
          .update({ background_image_url: data.url })
          .eq('id', selectedSession);

        if (error) throw error;
      }
    } catch (error) {
      toast({
        title: "Error generating image",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const sessionTypes = [
    { id: 'mindfulness', icon: Brain, label: 'Mindfulness' },
    { id: 'loving-kindness', icon: Heart, label: 'Loving-Kindness' },
    { id: 'focus', icon: Focus, label: 'Focus' },
    { id: 'morning', icon: Sun, label: 'Morning' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                  {session.background_image_url && (
                    <div className="aspect-video relative">
                      <img
                        src={session.background_image_url}
                        alt={session.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{session.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedSession(session.id);
                          handleGenerateImage(`Serene meditation scene for ${session.title}, peaceful and calming atmosphere`);
                        }}
                        disabled={isGeneratingImage}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{session.duration_minutes} minutes</span>
                      <Button variant="secondary" size="sm">
                        Start Session
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