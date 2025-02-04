import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SupplementIntakeForm } from "@/components/supplements/SupplementIntakeForm";
import { SupplementHistory } from "@/components/supplements/SupplementHistory";
import { SupplementChart } from "@/components/supplements/SupplementChart";
import { SupplementCorrelations } from "@/components/supplements/SupplementCorrelations";
import { SupplementCategories } from "@/components/supplements/SupplementCategories";
import { SupplementStats } from "@/components/supplements/SupplementStats";

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
    mutationFn: async (values: any) => {
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

      <Tabs defaultValue="log" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="log">Log Intake</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <Card>
            <CardHeader>
              <CardTitle>Log Supplement Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplementIntakeForm onSubmit={(values) => logSupplementMutation.mutate(values)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Supplement History</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplementHistory logs={supplementLogs || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Impact Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <SupplementChart data={supplementLogs || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <SupplementStats />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Correlations</CardTitle>
              </CardHeader>
              <CardContent>
                <SupplementCorrelations />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <SupplementCategories />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Supplements;