import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

export default function QuitPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [targetDate, setTargetDate] = useState("");
  const [initialUsage, setInitialUsage] = useState("");
  const [targetUsage, setTargetUsage] = useState("");
  const [strategy, setStrategy] = useState<"cold_turkey" | "taper_down" | "nrt_assisted" | "harm_reduction">("taper_down");
  const [productType, setProductType] = useState("");

  const { data: currentPlan } = useQuery({
    queryKey: ['quit-plan'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quit_plans')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const createPlan = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from('quit_plans')
        .insert([{
          user_id: session.user.id,
          strategy_type: strategy,
          initial_daily_usage: Number(initialUsage),
          target_daily_usage: Number(targetUsage),
          target_date: targetDate,
          product_type: productType,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quit-plan'] });
      toast({
        title: "Plan created",
        description: "Your quit plan has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quit plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quit Plan</h1>
        <Button variant="outline" onClick={() => navigate('/sobriety')}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create Your Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strategy">Quit Strategy</Label>
            <Select
              value={strategy}
              onValueChange={(value: typeof strategy) => setStrategy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cold_turkey">Cold Turkey</SelectItem>
                <SelectItem value="taper_down">Taper Down</SelectItem>
                <SelectItem value="nrt_assisted">NRT Assisted</SelectItem>
                <SelectItem value="harm_reduction">Harm Reduction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productType">Substance Type</Label>
            <Input
              id="productType"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g., Cigarettes, Alcohol"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialUsage">Current Daily Usage</Label>
              <Input
                id="initialUsage"
                type="number"
                value={initialUsage}
                onChange={(e) => setInitialUsage(e.target.value)}
                placeholder="Amount per day"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUsage">Target Daily Usage</Label>
              <Input
                id="targetUsage"
                type="number"
                value={targetUsage}
                onChange={(e) => setTargetUsage(e.target.value)}
                placeholder="Target amount"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Quit Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={() => createPlan.mutate()}
            disabled={createPlan.isPending}
          >
            {createPlan.isPending ? "Saving..." : "Save Plan"}
          </Button>
        </CardContent>
      </Card>

      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Strategy</p>
                <p className="font-medium capitalize">{currentPlan.strategy_type.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Date</p>
                <p className="font-medium">{new Date(currentPlan.target_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Initial Usage</p>
                <p className="font-medium">{currentPlan.initial_daily_usage} per day</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Usage</p>
                <p className="font-medium">{currentPlan.target_daily_usage} per day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}