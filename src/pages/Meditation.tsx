import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Brain, Heart, Focus, Sun } from "lucide-react";

const Meditation = () => {
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