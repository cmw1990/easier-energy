import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Coffee, Battery } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const CaffeinePage = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState(0);
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [notes, setNotes] = useState("");

  const { data: recentLogs } = useQuery({
    queryKey: ["caffeineLogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("energy_focus_logs")
        .select("*")
        .eq("activity_type", "caffeine")
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
        activity_type: "caffeine",
        activity_name: "Caffeine Intake",
        energy_rating: energyLevel[0],
        focus_rating: null,
        notes: `Caffeine amount: ${amount}mg. ${notes}`,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Caffeine intake logged successfully",
      });

      // Reset form
      setAmount(0);
      setEnergyLevel([5]);
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log caffeine intake",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Caffeine Tracking</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Log Caffeine Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Caffeine Amount (mg)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter amount in mg"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Energy Level</Label>
                <div className="flex items-center gap-4">
                  <Battery className="h-5 w-5 text-energy-low" />
                  <Slider
                    value={energyLevel}
                    onValueChange={setEnergyLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <Battery className="h-5 w-5 text-energy-high" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Current: {energyLevel}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about your caffeine intake"
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
            <CardTitle>Recent Logs</CardTitle>
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
                      Energy Level: {log.energy_rating}/10
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.notes}</p>
                </div>
              ))}
              {(!recentLogs || recentLogs.length === 0) && (
                <p className="text-center text-muted-foreground">
                  No caffeine logs yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaffeinePage;