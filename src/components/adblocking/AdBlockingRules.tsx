
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export function AdBlockingRules() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [newRule, setNewRule] = useState("");
  const [ruleType, setRuleType] = useState("network");

  const { data: rules, refetch } = useQuery({
    queryKey: ['ad-blocking-rules', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_blocking_rules')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const addRule = async () => {
    if (!session?.user?.id || !newRule) return;

    try {
      const { error } = await supabase
        .from('ad_blocking_rules')
        .insert({
          user_id: session.user.id,
          rule_type: ruleType,
          pattern: newRule,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Rule added",
        description: "Your new blocking rule has been added successfully."
      });

      setNewRule("");
      refetch();
    } catch (error) {
      console.error('Error adding rule:', error);
      toast({
        title: "Error adding rule",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const toggleRule = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('ad_blocking_rules')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast({
        title: "Error updating rule",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ad_blocking_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Rule deleted",
        description: "The blocking rule has been removed."
      });

      refetch();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: "Error removing rule",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter blocking rule pattern"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded-md"
          value={ruleType}
          onChange={(e) => setRuleType(e.target.value)}
        >
          <option value="network">Network</option>
          <option value="cosmetic">Cosmetic</option>
          <option value="script">Script</option>
          <option value="element">Element</option>
          <option value="custom">Custom</option>
        </select>
        <Button onClick={addRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {rules?.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between p-2 border rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Switch
                checked={rule.is_active}
                onCheckedChange={() => toggleRule(rule.id, rule.is_active)}
              />
              <div>
                <Label>{rule.pattern}</Label>
                <p className="text-sm text-muted-foreground">{rule.rule_type}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteRule(rule.id)}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
