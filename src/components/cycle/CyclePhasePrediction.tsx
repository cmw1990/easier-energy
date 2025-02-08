
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, CalendarClock } from "lucide-react";
import { format } from "date-fns";

export const CyclePhasePrediction = () => {
  const { session } = useAuth();

  const { data: predictions } = useQuery({
    queryKey: ['cycle_phase_predictions', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('cycle_phase_predictions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('predicted_end_date', new Date().toISOString().split('T')[0])
        .order('predicted_start_date', { ascending: true })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  if (!predictions) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          Predicted Cycle Phase
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Phase:</span>
            <span className="capitalize">{predictions.phase_type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Start Date:</span>
            <span>{format(new Date(predictions.predicted_start_date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">End Date:</span>
            <span>{format(new Date(predictions.predicted_end_date), 'MMM d, yyyy')}</span>
          </div>
          {predictions.confidence_score && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Prediction Confidence:</span>
              <span>{Math.round(predictions.confidence_score * 100)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
