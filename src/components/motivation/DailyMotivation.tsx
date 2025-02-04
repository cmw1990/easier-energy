import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Target, Trophy } from "lucide-react";

export const DailyMotivation = () => {
  const { toast } = useToast();
  const [dailyGoal, setDailyGoal] = useState("");

  const { data: quote } = useQuery({
    queryKey: ["dailyQuote"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("motivation_quotes")
        .select("*")
        .order("RANDOM()")
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const saveDailyGoal = async () => {
    const { error } = await supabase
      .from("motivation_tracking")
      .insert([{ daily_goal: dailyGoal }]);

    if (error) {
      toast({
        title: "Error saving goal",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Goal saved!",
        description: "Keep pushing forward!",
      });
      setDailyGoal("");
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-semibold">Daily Inspiration</h2>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg">
        <p className="text-lg italic">"{quote?.content}"</p>
        <p className="text-sm text-muted-foreground mt-2">- {quote?.author}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Set Your Daily Goal</h3>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={dailyGoal}
            onChange={(e) => setDailyGoal(e.target.value)}
            placeholder="What's your main goal for today?"
            className="flex-1"
          />
          <Button onClick={saveDailyGoal}>Save</Button>
        </div>
      </div>
    </Card>
  );
};