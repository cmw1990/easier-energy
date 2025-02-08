
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Cloud, ThermometerSun } from "lucide-react";
import type { CycleWeatherImpact as CycleWeatherImpactType } from "@/types/cycle";
import { format } from "date-fns";

export const CycleWeatherImpact = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: weatherImpacts } = useQuery({
    queryKey: ['cycle_weather_impacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycle_weather_impacts')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      if (error) throw error;
      return data as CycleWeatherImpactType[];
    },
    enabled: !!session?.user?.id,
  });

  const addWeatherImpact = useMutation({
    mutationFn: async (impact: Omit<CycleWeatherImpactType, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('cycle_weather_impacts')
        .insert(impact)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle_weather_impacts'] });
      toast({
        title: "Weather impact logged",
        description: "Your weather impact data has been saved",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    addWeatherImpact.mutate({
      user_id: session.user.id,
      date: new Date().toISOString().split('T')[0],
      symptom_type: formData.get('symptom_type') as string,
      symptom_intensity: parseInt(formData.get('symptom_intensity') as string),
      phase_type: formData.get('phase_type') as string,
      weather_data: {
        temperature: parseFloat(formData.get('temperature') as string),
        humidity: parseFloat(formData.get('humidity') as string),
        pressure: parseFloat(formData.get('pressure') as string),
        condition: formData.get('condition')
      },
      notes: formData.get('notes') as string
    });

    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-500" />
          Weather Impact Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Symptom Type</Label>
            <Select name="symptom_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select symptom type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headache">Headache</SelectItem>
                <SelectItem value="fatigue">Fatigue</SelectItem>
                <SelectItem value="mood">Mood Changes</SelectItem>
                <SelectItem value="pain">Pain</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phase Type</Label>
            <Select name="phase_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select cycle phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menstrual">Menstrual</SelectItem>
                <SelectItem value="follicular">Follicular</SelectItem>
                <SelectItem value="ovulatory">Ovulatory</SelectItem>
                <SelectItem value="luteal">Luteal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Symptom Intensity (1-10)</Label>
            <Slider 
              name="symptom_intensity"
              defaultValue={[5]}
              max={10}
              min={1}
              step={1}
              className="py-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Temperature (°C)</Label>
              <input 
                type="number" 
                name="temperature"
                className="w-full p-2 border rounded"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label>Humidity (%)</Label>
              <input 
                type="number" 
                name="humidity"
                className="w-full p-2 border rounded"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Weather Condition</Label>
            <Select name="condition">
              <SelectTrigger>
                <SelectValue placeholder="Select weather condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunny">Sunny</SelectItem>
                <SelectItem value="cloudy">Cloudy</SelectItem>
                <SelectItem value="rainy">Rainy</SelectItem>
                <SelectItem value="stormy">Stormy</SelectItem>
                <SelectItem value="windy">Windy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <textarea 
              name="notes"
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Any additional observations..."
            />
          </div>

          <Button type="submit" className="w-full">
            Log Weather Impact
          </Button>
        </form>

        {weatherImpacts?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-4">Recent Weather Impacts</h3>
            <div className="space-y-2">
              {weatherImpacts.map((impact) => (
                <div 
                  key={impact.id} 
                  className="p-3 bg-muted rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium capitalize">{impact.symptom_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(impact.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Intensity: {impact.symptom_intensity}/10</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {impact.weather_data.condition}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
