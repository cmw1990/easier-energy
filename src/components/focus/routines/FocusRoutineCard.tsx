
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ListChecks, Plus, Save } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface RoutineStep {
  id: string;
  description: string;
  duration: number;
}

export const FocusRoutineCard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [newStep, setNewStep] = useState("");
  const [stepDuration, setStepDuration] = useState("");

  const addStep = () => {
    if (!newStep || !stepDuration) return;
    
    setSteps([
      ...steps,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: newStep,
        duration: parseInt(stepDuration),
      },
    ]);
    
    setNewStep("");
    setStepDuration("");
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save routines",
        variant: "destructive",
      });
      return;
    }

    try {
      const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
      const { error } = await supabase.from("focus_routines").insert({
        user_id: session.user.id,
        name,
        steps: JSON.stringify(steps), // Convert steps array to JSON string
        duration_minutes: totalDuration,
      });

      if (error) throw error;

      toast({
        title: "Routine saved",
        description: "Your focus routine has been saved successfully",
      });

      setName("");
      setSteps([]);
    } catch (error) {
      console.error("Error saving routine:", error);
      toast({
        title: "Error",
        description: "Failed to save routine. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-green-500" />
          Create Focus Routine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Routine Name</Label>
          <Input
            placeholder="e.g., Morning Focus Ritual"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Add Step</Label>
          <div className="flex gap-2">
            <Textarea
              placeholder="Step description"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Minutes"
              value={stepDuration}
              onChange={(e) => setStepDuration(e.target.value)}
              className="w-24"
            />
            <Button onClick={addStep} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {steps.length > 0 && (
          <div className="space-y-2">
            <Label>Steps</Label>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 p-2 bg-background rounded-md">
                  <span className="font-medium">{index + 1}.</span>
                  <span className="flex-1">{step.description}</span>
                  <span className="text-sm text-muted-foreground">{step.duration}m</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Routine
        </Button>
      </CardContent>
    </Card>
  );
};
