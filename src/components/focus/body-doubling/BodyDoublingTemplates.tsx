
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, Clock, Tag } from "lucide-react";

interface Template {
  id: string;
  template_name: string;
  description: string;
  duration_minutes: number;
  max_participants: number;
  recurring_schedule: any;
  focus_area: string[];
}

export const BodyDoublingTemplates = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({
    template_name: "",
    description: "",
    duration_minutes: 60,
    max_participants: 5,
    focus_area: [] as string[],
  });
  const [areaInput, setAreaInput] = useState("");

  useEffect(() => {
    if (session?.user) {
      loadTemplates();
    }
  }, [session?.user]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('body_doubling_templates')
        .select('*')
        .eq('user_id', session?.user.id);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error loading templates",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const addTemplate = async () => {
    if (!newTemplate.template_name) {
      toast({
        title: "Template name required",
        description: "Please enter a template name",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('body_doubling_templates').insert({
        user_id: session?.user.id,
        template_name: newTemplate.template_name,
        description: newTemplate.description,
        duration_minutes: newTemplate.duration_minutes,
        max_participants: newTemplate.max_participants,
        focus_area: newTemplate.focus_area,
      });

      if (error) throw error;

      toast({
        title: "Template added",
        description: "Your body doubling template has been created"
      });

      setNewTemplate({
        template_name: "",
        description: "",
        duration_minutes: 60,
        max_participants: 5,
        focus_area: [],
      });
      loadTemplates();
    } catch (error) {
      console.error('Error adding template:', error);
      toast({
        title: "Error adding template",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const addFocusArea = () => {
    if (areaInput && !newTemplate.focus_area.includes(areaInput)) {
      setNewTemplate({
        ...newTemplate,
        focus_area: [...newTemplate.focus_area, areaInput]
      });
      setAreaInput("");
    }
  };

  const removeFocusArea = (area: string) => {
    setNewTemplate({
      ...newTemplate,
      focus_area: newTemplate.focus_area.filter(a => a !== area)
    });
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Body Doubling Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Template Name</Label>
              <Input
                placeholder="Enter template name"
                value={newTemplate.template_name}
                onChange={(e) => setNewTemplate({ ...newTemplate, template_name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Input
                placeholder="Enter description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  min="15"
                  max="240"
                  value={newTemplate.duration_minutes}
                  onChange={(e) => setNewTemplate({ ...newTemplate, duration_minutes: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  min="2"
                  max="20"
                  value={newTemplate.max_participants}
                  onChange={(e) => setNewTemplate({ ...newTemplate, max_participants: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Focus Areas</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add focus area"
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFocusArea()}
                />
                <Button onClick={addFocusArea} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newTemplate.focus_area.map((area) => (
                  <span
                    key={area}
                    className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-sm flex items-center gap-1"
                  >
                    {area}
                    <button
                      onClick={() => removeFocusArea(area)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={addTemplate} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{template.template_name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {template.duration_minutes}min
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.focus_area.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-1 rounded-full bg-blue-100/50 text-blue-700 text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
