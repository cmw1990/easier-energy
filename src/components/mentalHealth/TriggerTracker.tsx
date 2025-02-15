
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
import { Brain, Plus } from "lucide-react";
import type { MoodTrigger } from "@/types/supabase";

export const TriggerTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTrigger, setNewTrigger] = useState({
    name: "",
    category: "emotional",
    impact: 5,
    frequency: "occasional",
    notes: ""
  });

  const { data: triggers } = useQuery<MoodTrigger[]>({
    queryKey: ['mood-triggers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mood_triggers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const addTrigger = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('mood_triggers')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          trigger_name: newTrigger.name,
          trigger_category: newTrigger.category,
          impact_level: newTrigger.impact,
          frequency: newTrigger.frequency,
          notes: newTrigger.notes
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-triggers'] });
      toast({
        title: "Trigger added",
        description: "Your mood trigger has been recorded"
      });
      setNewTrigger({
        name: "",
        category: "emotional",
        impact: 5,
        frequency: "occasional",
        notes: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add trigger. Please try again.",
        variant: "destructive"
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Mood Trigger Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="What triggers your mood change?"
            value={newTrigger.name}
            onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Select
            value={newTrigger.category}
            onValueChange={(value) => setNewTrigger({ ...newTrigger, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emotional">Emotional</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
              <SelectItem value="work">Work-related</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm">Impact Level ({newTrigger.impact}/10)</p>
          <Slider
            value={[newTrigger.impact]}
            onValueChange={([value]) => setNewTrigger({ ...newTrigger, impact: value })}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Select
            value={newTrigger.frequency}
            onValueChange={(value) => setNewTrigger({ ...newTrigger, frequency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="How often does this occur?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="occasional">Occasional</SelectItem>
              <SelectItem value="frequent">Frequent</SelectItem>
              <SelectItem value="very_frequent">Very Frequent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Additional notes..."
          value={newTrigger.notes}
          onChange={(e) => setNewTrigger({ ...newTrigger, notes: e.target.value })}
        />

        <Button 
          className="w-full" 
          onClick={() => addTrigger.mutate()}
          disabled={!newTrigger.name || addTrigger.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trigger
        </Button>

        {triggers && triggers.length > 0 && (
          <div className="mt-4 space-y-3">
            <h3 className="font-medium">Recent Triggers</h3>
            {triggers.map((trigger) => (
              <Card key={trigger.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{trigger.trigger_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Category: {trigger.trigger_category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Impact: {trigger.impact_level}/10
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {trigger.frequency}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
