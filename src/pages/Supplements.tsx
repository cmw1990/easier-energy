import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SupplementIntakeForm } from "@/components/supplements/SupplementIntakeForm";
import { SupplementHistory } from "@/components/supplements/SupplementHistory";
import { SupplementChart } from "@/components/supplements/SupplementChart";
import { SupplementCorrelations } from "@/components/supplements/SupplementCorrelations";

const Supplements = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: supplementLogs } = useQuery({
    queryKey: ['supplementLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplement_logs')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const logSupplementMutation = useMutation({
    mutationFn: async (values: {
      supplement_name: string;
      dosage: string;
      form?: string;
      brand?: string;
      cost?: number;
      source?: string;
      batch_number?: string;
      expiration_date?: string;
      storage_conditions?: string;
      purchase_location?: string;
      verified_purchase?: boolean;
      effectiveness_rating?: number;
      energy_impact?: number;
      stress_impact?: number;
      focus_impact?: number;
      mood_impact?: number;
      sleep_impact?: number;
      side_effects?: string;
      timing_notes?: string;
      interaction_notes?: string;
      notes?: string;
      reminder_enabled?: boolean;
      reminder_time?: string;
      time_taken: string;
    }) => {
      const { error } = await supabase
        .from('supplement_logs')
        .insert({
          user_id: session?.user?.id,
          ...values,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplementLogs'] });
      toast({
        title: "Success",
        description: "Supplement intake logged successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log supplement intake",
        variant: "destructive",
      });
      console.error("Error logging supplement:", error);
    },
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Supplement Tracker</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Supplement Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplementIntakeForm onSubmit={(values) => logSupplementMutation.mutate(values)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplementHistory logs={supplementLogs || []} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Supplement Impact Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplementChart data={supplementLogs || []} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Impact Correlations</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplementCorrelations />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Supplements;