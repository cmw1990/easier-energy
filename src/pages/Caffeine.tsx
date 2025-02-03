import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Coffee, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CAFFEINE_REFERENCE = [
  { name: "Coffee (8 oz)", amount: 95 },
  { name: "Espresso (1 oz)", amount: 64 },
  { name: "Black Tea (8 oz)", amount: 47 },
  { name: "Green Tea (8 oz)", amount: 28 },
  { name: "Energy Drink (8 oz)", amount: 80 },
  { name: "Cola (12 oz)", amount: 34 },
];

const Caffeine = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [energyRating, setEnergyRating] = useState("");
  const [consumedAt, setConsumedAt] = useState(new Date().toISOString().slice(0, 16));

  const { data: caffeineHistory } = useQuery({
    queryKey: ["caffeineHistory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("energy_focus_logs")
        .select("*")
        .eq("user_id", session?.user?.id)
        .eq("activity_type", "caffeine")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: chartData } = useQuery({
    queryKey: ["caffeineChartData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("energy_focus_logs")
        .select("*")
        .eq("user_id", session?.user?.id)
        .eq("activity_type", "caffeine")
        .order("created_at", { ascending: true })
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .limit(50);

      if (error) throw error;

      const processedData = data.map(log => ({
        date: new Date(log.created_at).toLocaleDateString(),
        amount: parseInt(log.activity_name.split(":")[1]),
        energy: log.energy_rating
      }));

      return processedData;
    },
    enabled: !!session?.user?.id,
  });

  const logCaffeineMutation = useMutation({
    mutationFn: async (values: { amount: string; energyRating: string; consumedAt: string }) => {
      const { error } = await supabase.from("energy_focus_logs").insert({
        user_id: session?.user?.id,
        activity_type: "caffeine",
        activity_name: `Caffeine Intake: ${values.amount}mg`,
        energy_rating: parseInt(values.energyRating),
        created_at: values.consumedAt,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caffeineHistory"] });
      queryClient.invalidateQueries({ queryKey: ["caffeineChartData"] });
      toast({
        title: "Success",
        description: "Caffeine intake logged successfully",
      });
      setAmount("");
      setEnergyRating("");
      setConsumedAt(new Date().toISOString().slice(0, 16));
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log caffeine intake",
        variant: "destructive",
      });
      console.error("Error logging caffeine:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !energyRating) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    logCaffeineMutation.mutate({ amount, energyRating, consumedAt });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Caffeine Tracker</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Log Caffeine Intake
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Common Caffeine Amounts</h4>
                    <div className="grid gap-2">
                      {CAFFEINE_REFERENCE.map((item) => (
                        <div key={item.name} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="font-mono">{item.amount}mg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Caffeine Amount (mg)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 95 for a cup of coffee"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="energyRating">Energy Rating (1-10)</Label>
                <Input
                  id="energyRating"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Rate your energy level"
                  value={energyRating}
                  onChange={(e) => setEnergyRating(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumedAt">Time Consumed</Label>
                <Input
                  id="consumedAt"
                  type="datetime-local"
                  value={consumedAt}
                  onChange={(e) => setConsumedAt(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Log Intake
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caffeineHistory?.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{log.activity_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Energy Level: {log.energy_rating}/10
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {(!caffeineHistory || caffeineHistory.length === 0) && (
                <p className="text-center text-muted-foreground">
                  No caffeine intake logged yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Caffeine Intake Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" label={{ value: 'Caffeine (mg)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Energy Level', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="amount" stroke="#8884d8" name="Caffeine Intake" />
                  <Line yAxisId="right" type="monotone" dataKey="energy" stroke="#82ca9d" name="Energy Level" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Caffeine;