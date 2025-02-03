import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Moon, Battery } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

const SleepTrackPage = () => {
  const { toast } = useToast();
  const [duration, setDuration] = useState("");
  const [quality, setQuality] = useState([5]);
  const [notes, setNotes] = useState("");

  const { data: recentLogs, refetch } = useQuery({
    queryKey: ["sleepLogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("energy_focus_logs")
        .select("*")
        .eq("activity_type", "sleep")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("energy_focus_logs").insert({
        activity_type: "sleep",
        activity_name: "Sleep Session",
        duration_minutes: Number(duration) * 60, // Convert hours to minutes
        energy_rating: quality[0],
        notes,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sleep session logged successfully",
      });

      // Reset form and refresh data
      setDuration("");
      setQuality([5]);
      setNotes("");
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log sleep session",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Sleep Tracking</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Log Sleep Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Sleep Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter sleep duration"
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="space-y-2">
                <Label>Sleep Quality</Label>
                <div className="flex items-center gap-4">
                  <Battery className="h-5 w-5 text-sleep-low" />
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    max={10}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <Battery className="h-5 w-5 text-sleep-high" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Rating: {quality}/10
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about your sleep"
                />
              </div>

              <Button type="submit" className="w-full">
                Log Sleep
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sleep Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Duration: {Math.round((log.duration_minutes || 0) / 60)} hours
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Quality: {log.energy_rating}/10</span>
                  </div>
                  {log.notes && (
                    <p className="text-sm text-muted-foreground">{log.notes}</p>
                  )}
                </div>
              ))}
              {(!recentLogs || recentLogs.length === 0) && (
                <p className="text-center text-muted-foreground">
                  No sleep logs yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SleepTrackPage;