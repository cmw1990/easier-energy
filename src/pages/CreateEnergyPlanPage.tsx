import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlanType, PlanCategory } from "@/types/energyPlans";

const initialValues = {
  title: "",
  description: "",
  plan_type: "mental_clarity" as PlanType,
  category: "charged" as PlanCategory,
  visibility: "public",
  is_expert_plan: false,
  energy_level_required: 5,
  estimated_duration_minutes: 30,
};

const CreateEnergyPlanPage = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [values, setValues] = useState(initialValues);

  const handleSubmit = async (values: typeof initialValues) => {
    if (!session?.user?.id) return;

    const planData = {
      ...values,
      created_by: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('energy_plans')
      .insert(planData);

    if (error) {
      toast({
        title: "Error creating plan",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Plan created",
      description: "Your energy plan has been created successfully!"
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Energy Plan</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(values);
      }} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="plan_type">Plan Type</Label>
          <Select onValueChange={(value) => setValues({ ...values, plan_type: value as PlanType })}>
            <SelectTrigger>
              <SelectValue placeholder="Select plan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mental_clarity">Mental Clarity</SelectItem>
              <SelectItem value="deep_relaxation">Deep Relaxation</SelectItem>
              <SelectItem value="stress_relief">Stress Relief</SelectItem>
              <SelectItem value="meditation">Meditation</SelectItem>
              <SelectItem value="energizing_boost">Energizing Boost</SelectItem>
              <SelectItem value="sustained_focus">Sustained Focus</SelectItem>
              <SelectItem value="physical_vitality">Physical Vitality</SelectItem>
              <SelectItem value="evening_winddown">Evening Wind Down</SelectItem>
              <SelectItem value="sleep_preparation">Sleep Preparation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => setValues({ ...values, category: value as PlanCategory })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="charged">Charged</SelectItem>
              <SelectItem value="recharged">Recharged</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <Select onValueChange={(value) => setValues({ ...values, visibility: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="energy_level_required">Energy Level Required</Label>
          <Input
            id="energy_level_required"
            type="number"
            value={String(values.energy_level_required)}
            onChange={(e) => setValues({ ...values, energy_level_required: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="estimated_duration_minutes">Estimated Duration (minutes)</Label>
          <Input
            id="estimated_duration_minutes"
            type="number"
            value={String(values.estimated_duration_minutes)}
            onChange={(e) => setValues({ ...values, estimated_duration_minutes: Number(e.target.value) })}
          />
        </div>
        <Button type="submit">Create Plan</Button>
      </form>
    </div>
  );
};

export default CreateEnergyPlanPage;
