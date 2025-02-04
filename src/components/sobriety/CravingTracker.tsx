import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ChartBar, Clock, MapPin } from "lucide-react";

export const CravingTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [intensity, setIntensity] = useState(5);
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");

  const { data: recentCravings } = useQuery({
    queryKey: ['craving-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('craving_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const logCraving = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('craving_logs')
        .insert([{
          intensity,
          location,
          activity,
          notes,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['craving-logs'] });
      toast({
        title: "Craving logged",
        description: "Your craving has been recorded successfully.",
      });
      setLocation("");
      setActivity("");
      setNotes("");
      setIntensity(5);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log craving. Please try again.",
        variant: "destructive",
      });
      console.error("Error logging craving:", error);
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="h-5 w-5" />
          Track Craving
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Intensity</Label>
          <Slider
            value={[intensity]}
            onValueChange={(value) => setIntensity(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where are you?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Current Activity
          </Label>
          <Input
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="What are you doing?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
          />
        </div>

        <Button 
          className="w-full"
          onClick={() => logCraving.mutate()}
          disabled={logCraving.isPending}
        >
          Log Craving
        </Button>

        {recentCravings && recentCravings.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Recent Cravings</h3>
            <div className="space-y-3">
              {recentCravings.map((craving) => (
                <Card key={craving.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Intensity: {craving.intensity}/10</p>
                        {craving.location && (
                          <p className="text-sm text-muted-foreground">
                            Location: {craving.location}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(craving.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};