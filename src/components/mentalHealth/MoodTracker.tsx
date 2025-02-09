
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MoodTracker() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [moodScore, setMoodScore] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);

  const { data: moodHistory, refetch } = useQuery({
    queryKey: ['mood-history', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('mental_health_progress')
        .select('*')
        .eq('client_id', session?.user?.id)
        .order('date', { ascending: false })
        .limit(7);
      return data;
    },
    enabled: !!session?.user?.id
  });

  const saveMoodEntry = async () => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from('mental_health_progress')
      .insert({
        client_id: session.user.id,
        mood_score: moodScore,
        energy_level: energyLevel,
        sleep_quality: sleepQuality,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save mood entry",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Mood entry saved successfully!"
      });
      refetch();
    }
  };

  const chartData = moodHistory?.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    mood: entry.mood_score,
    energy: entry.energy_level,
    sleep: entry.sleep_quality
  })).reverse();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Track Your Mood</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                How are you feeling? ({moodScore}/10)
              </label>
              <Slider
                value={[moodScore]}
                onValueChange={([value]) => setMoodScore(value)}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Energy Level ({energyLevel}/10)
              </label>
              <Slider
                value={[energyLevel]}
                onValueChange={([value]) => setEnergyLevel(value)}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sleep Quality ({sleepQuality}/10)
              </label>
              <Slider
                value={[sleepQuality]}
                onValueChange={([value]) => setSleepQuality(value)}
                max={10}
                step={1}
              />
            </div>

            <Button onClick={saveMoodEntry} className="w-full">
              Save Entry
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData && chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#ec4899" 
                      name="Mood"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#eab308" 
                      name="Energy"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sleep" 
                      stroke="#3b82f6" 
                      name="Sleep"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No mood data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
