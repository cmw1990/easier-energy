import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Activity, Heart } from "lucide-react";

type HealthCondition = 'adhd' | 'chronic_fatigue' | 'multiple_sclerosis' | 'other_fatigue' | 'other_focus_issue';

const CONDITIONS: { id: HealthCondition; label: string; icon: JSX.Element }[] = [
  { id: 'adhd', label: 'ADHD', icon: <Brain className="h-4 w-4" /> },
  { id: 'chronic_fatigue', label: 'Chronic Fatigue', icon: <Activity className="h-4 w-4" /> },
  { id: 'multiple_sclerosis', label: 'Multiple Sclerosis', icon: <Heart className="h-4 w-4" /> },
  { id: 'other_fatigue', label: 'Other Fatigue Issues', icon: <Activity className="h-4 w-4" /> },
  { id: 'other_focus_issue', label: 'Other Focus Issues', icon: <Brain className="h-4 w-4" /> },
];

export const HealthConditionForm = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [selectedConditions, setSelectedConditions] = useState<HealthCondition[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_health_conditions')
        .upsert({
          user_id: session.user.id,
          conditions: selectedConditions,
          needs_energy_support: selectedConditions.some(c => ['chronic_fatigue', 'multiple_sclerosis', 'other_fatigue'].includes(c)),
          needs_focus_support: selectedConditions.some(c => ['adhd', 'other_focus_issue'].includes(c))
        });

      if (error) throw error;

      toast({
        title: "Health conditions updated",
        description: "We'll tailor your experience based on your needs.",
      });
    } catch (error) {
      console.error('Error updating health conditions:', error);
      toast({
        title: "Error updating health conditions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personalize Your Experience</h3>
        <p className="text-sm text-muted-foreground">
          Select any conditions that apply to you. We'll tailor our recommendations
          to better support your needs.
        </p>
        
        <div className="space-y-3">
          {CONDITIONS.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-2">
              <Checkbox
                id={condition.id}
                checked={selectedConditions.includes(condition.id)}
                onCheckedChange={(checked) => {
                  setSelectedConditions(prev =>
                    checked
                      ? [...prev, condition.id]
                      : prev.filter(c => c !== condition.id)
                  );
                }}
              />
              <label
                htmlFor={condition.id}
                className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {condition.icon}
                {condition.label}
              </label>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Updating..." : "Update Health Profile"}
        </Button>
      </div>
    </Card>
  );
};