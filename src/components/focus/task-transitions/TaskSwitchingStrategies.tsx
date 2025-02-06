
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  Folder,
  Brain,
  Plus,
  Edit2,
  Trash2,
  Star,
  Activity
} from "lucide-react";

interface TaskSwitchingStrategy {
  id: string;
  strategy_name: string;
  strategy_type: string;
  description: string;
  effectiveness_rating: number;
  context_tags: string[];
  mindfulness_elements?: Record<string, any>;
  physical_elements?: Record<string, any>;
  environmental_adjustments?: Record<string, any>;
  trigger_patterns?: Record<string, any>;
  success_metrics?: Record<string, any>;
}

export const TaskSwitchingStrategies = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<TaskSwitchingStrategy[]>([]);
  const [newStrategy, setNewStrategy] = useState<Partial<TaskSwitchingStrategy>>({
    strategy_name: "",
    strategy_type: "mindfulness",
    description: "",
    effectiveness_rating: 0,
    context_tags: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      loadStrategies();
    }
  }, [session?.user]);

  const loadStrategies = async () => {
    try {
      const { data, error } = await supabase
        .from("task_switching_strategies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStrategies(data || []);
    } catch (error) {
      console.error("Error loading strategies:", error);
      toast({
        title: "Error loading strategies",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!session?.user?.id || !newStrategy.strategy_name) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      if (editingId) {
        const { error } = await supabase
          .from("task_switching_strategies")
          .update({
            ...newStrategy,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Strategy updated",
          description: "Your task switching strategy has been updated"
        });
      } else {
        const { error } = await supabase
          .from("task_switching_strategies")
          .insert([
            {
              ...newStrategy,
              user_id: session.user.id
            }
          ]);

        if (error) throw error;

        toast({
          title: "Strategy saved",
          description: "Your new task switching strategy has been saved"
        });
      }

      setNewStrategy({
        strategy_name: "",
        strategy_type: "mindfulness",
        description: "",
        effectiveness_rating: 0,
        context_tags: []
      });
      setIsEditing(false);
      setEditingId(null);
      loadStrategies();
    } catch (error) {
      console.error("Error saving strategy:", error);
      toast({
        title: "Error saving strategy",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (strategy: TaskSwitchingStrategy) => {
    setNewStrategy(strategy);
    setIsEditing(true);
    setEditingId(strategy.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("task_switching_strategies")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Strategy deleted",
        description: "The task switching strategy has been removed"
      });

      loadStrategies();
    } catch (error) {
      console.error("Error deleting strategy:", error);
      toast({
        title: "Error deleting strategy",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Task Switching Strategies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Strategy Name</Label>
            <Input
              placeholder="Enter strategy name"
              value={newStrategy.strategy_name}
              onChange={(e) =>
                setNewStrategy({ ...newStrategy, strategy_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your strategy..."
              value={newStrategy.description}
              onChange={(e) =>
                setNewStrategy({ ...newStrategy, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={newStrategy.strategy_type}
              onChange={(e) =>
                setNewStrategy({ ...newStrategy, strategy_type: e.target.value })
              }
            >
              <option value="mindfulness">Mindfulness</option>
              <option value="physical">Physical</option>
              <option value="environmental">Environmental</option>
              <option value="cognitive">Cognitive</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Effectiveness Rating (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={newStrategy.effectiveness_rating}
              onChange={(e) =>
                setNewStrategy({
                  ...newStrategy,
                  effectiveness_rating: parseInt(e.target.value)
                })
              }
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            {isEditing ? (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Update Strategy
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Strategy
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="p-4 bg-white/50 dark:bg-gray-800/50">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <Folder className="h-4 w-4 text-purple-500" />
                    {strategy.strategy_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {strategy.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    {strategy.strategy_type}
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {strategy.effectiveness_rating}/5
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(strategy)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(strategy.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
