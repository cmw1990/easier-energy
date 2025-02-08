
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
import type { CycleWeatherImpact } from "@/types/cycle";

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
      return data as CycleWeatherImpact[];
    },
    enabled: !!session?.user?.id,
  });

  const addWeatherImpact = useMutation({
    mutationFn: async (impact: Omit<CycleWeatherImpact, 'id' | 'created_at'>) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-500" />
          Weather Impact Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Weather impact tracking form will go here */}
        </div>
      </CardContent>
    </Card>
  );
};
