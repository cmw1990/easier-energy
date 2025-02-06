import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Brain, Plus, Save, Zap, ListChecks } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface MicroStep {
  id: string;
  description: string;
  isCompleted: boolean;
  estimatedMinutes: number;
}

interface VisualAid {
  type: 'image' | 'checklist' | 'mindmap';
  content: string;
}

export const ADHDTaskBreakdown = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [taskName, setTaskName] = useState("");
  const [microSteps, setMicroSteps] = useState<MicroStep[]>([]);
  const [newStep, setNewStep] = useState("");
  const [stepEstimate, setStepEstimate] = useState("5");
  const [energyLevel, setEnergyLevel] = useState(5);
  const [motivationNotes, setMotivationNotes] = useState("");
  const [reward, setReward] = useState("");

  const addMicroStep = () => {
    if (!newStep || !stepEstimate) return;
    
    setMicroSteps([
      ...microSteps,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: newStep,
        isCompleted: false,
        estimatedMinutes: parseInt(stepEstimate),
      },
    ]);
    
    setNewStep("");
    setStepEstimate("5");
  };

  const toggleStepCompletion = (stepId: string) => {
    setMicroSteps(microSteps.map(step => 
      step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
    ));
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save task breakdowns",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("focus_task_breakdowns").insert({
        user_id: session.user.id,
        micro_steps: JSON.stringify(microSteps),
        energy_level_required: energyLevel,
        motivation_notes: motivationNotes,
        rewards: JSON.stringify({ reward }),
        time_estimates: JSON.stringify({
          total_minutes: microSteps.reduce((acc, step) => acc + step.estimatedMinutes, 0),
          steps: microSteps.map(step => ({
            description: step.description,
            minutes: step.estimatedMinutes,
          })),
        }),
      });

      if (error) throw error;

      toast({
        title: "Task breakdown saved",
        description: "Your ADHD-friendly task breakdown has been saved successfully",
      });

      // Reset form
      setTaskName("");
      setMicroSteps([]);
      setMotivationNotes("");
      setReward("");
      setEnergyLevel(5);
    } catch (error) {
      console.error("Error saving task breakdown:", error);
      toast({
        title: "Error",
        description: "Failed to save task breakdown. Please try again.",
        variant: "destructive",
      });
    }
  };

  const completedSteps = microSteps.filter(step => step.isCompleted).length;
  const progress = microSteps.length ? (completedSteps / microSteps.length) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          ADHD Task Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Task Name</Label>
          <Input
            placeholder="What do you want to accomplish?"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Break It Down - Add Small Steps</Label>
          <div className="flex gap-2">
            <Textarea
              placeholder="Describe a small, manageable step"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Minutes"
              value={stepEstimate}
              onChange={(e) => setStepEstimate(e.target.value)}
              className="w-24"
            />
            <Button onClick={addMicroStep} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {microSteps.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Progress</Label>
              <span className="text-sm text-muted-foreground">
                {completedSteps} of {microSteps.length} steps completed
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="space-y-2">
              {microSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2 p-2 bg-background rounded-md hover:bg-accent transition-colors"
                  onClick={() => toggleStepCompletion(step.id)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer
                    ${step.isCompleted ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>
                    {step.isCompleted && <ListChecks className="h-3 w-3 text-white" />}
                  </div>
                  <span className="flex-1">{step.description}</span>
                  <span className="text-sm text-muted-foreground">{step.estimatedMinutes}m</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Energy Level Required</Label>
          <div className="flex items-center gap-4">
            <Zap className="h-4 w-4 text-yellow-500" />
            <Slider
              value={[energyLevel]}
              onValueChange={(value) => setEnergyLevel(value[0])}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="w-8 text-sm">{energyLevel}/10</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Motivation Notes</Label>
          <Textarea
            placeholder="Why is this task important? What will it help you achieve?"
            value={motivationNotes}
            onChange={(e) => setMotivationNotes(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Reward</Label>
          <Input
            placeholder="How will you reward yourself after completing this?"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Breakdown
        </Button>

        {microSteps.length > 0 && (
          <div className="p-4 rounded-lg bg-primary/10 space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Task Management Tips
            </h3>
            <ul className="space-y-1 text-sm">
              <li>• Focus on one micro-step at a time</li>
              <li>• Take breaks between steps</li>
              <li>• Celebrate completing each step</li>
              <li>• Adjust time estimates as needed</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
