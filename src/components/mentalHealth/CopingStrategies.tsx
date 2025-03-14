
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, Check } from "lucide-react";
import type { CopingStrategy } from "@/types/supabase";

export const CopingStrategies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newStrategy, setNewStrategy] = useState({
    name: "",
    category: "relaxation",
    effectiveness: 5,
    notes: ""
  });

  const { data: strategies } = useQuery<CopingStrategy[]>({
    queryKey: ['coping-strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coping_strategies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const addStrategy = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('coping_strategies')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          strategy_name: newStrategy.name,
          category: newStrategy.category,
          effectiveness_rating: newStrategy.effectiveness,
          notes: newStrategy.notes
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coping-strategies'] });
      toast({
        title: "Strategy added",
        description: "Your coping strategy has been saved"
      });
      setNewStrategy({
        name: "",
        category: "relaxation",
        effectiveness: 5,
        notes: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add strategy. Please try again.",
        variant: "destructive"
      });
    }
  });

  const useStrategy = useMutation({
    mutationFn: async (strategyId: string) => {
      const strategy = strategies?.find(s => s.id === strategyId);
      if (!strategy) return;

      const { error } = await supabase
        .from('coping_strategies')
        .update({ used_count: (strategy.used_count || 0) + 1 })
        .eq('id', strategyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coping-strategies'] });
      toast({
        title: "Strategy used",
        description: "Great job using your coping strategy!"
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Coping Strategies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="What helps you cope?"
            value={newStrategy.name}
            onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Select
            value={newStrategy.category}
            onValueChange={(value) => setNewStrategy({ ...newStrategy, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relaxation">Relaxation</SelectItem>
              <SelectItem value="physical">Physical Activity</SelectItem>
              <SelectItem value="social">Social Support</SelectItem>
              <SelectItem value="creative">Creative Expression</SelectItem>
              <SelectItem value="mindfulness">Mindfulness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm">Effectiveness ({newStrategy.effectiveness}/10)</p>
          <Slider
            value={[newStrategy.effectiveness]}
            onValueChange={([value]) => setNewStrategy({ ...newStrategy, effectiveness: value })}
            max={10}
            step={1}
          />
        </div>

        <Textarea
          placeholder="Additional notes..."
          value={newStrategy.notes}
          onChange={(e) => setNewStrategy({ ...newStrategy, notes: e.target.value })}
        />

        <Button 
          className="w-full" 
          onClick={() => addStrategy.mutate()}
          disabled={!newStrategy.name || addStrategy.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Strategy
        </Button>

        {strategies && strategies.length > 0 && (
          <div className="mt-4 space-y-3">
            <h3 className="font-medium">Your Coping Strategies</h3>
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{strategy.strategy_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Category: {strategy.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Effectiveness: {strategy.effectiveness_rating}/10
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Used {strategy.used_count} times
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => useStrategy.mutate(strategy.id)}
                    disabled={useStrategy.isPending}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Used Today
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
