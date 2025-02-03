import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Activity } from "lucide-react";

export const SmartBlockingRules = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    adaptiveMode: false,
    learningEnabled: true,
    productivityThreshold: 70,
    autoAdjust: true
  });

  useEffect(() => {
    loadSettings();
  }, [session?.user?.id]);

  const loadSettings = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('distraction_blocking')
        .select('pattern_data')
        .eq('user_id', session.user.id)
        .eq('block_type', 'smart')
        .single();

      if (error) throw error;

      if (data?.pattern_data) {
        setSettings(data.pattern_data);
      }
    } catch (error) {
      console.error('Error loading smart blocking settings:', error);
      toast({
        title: "Error loading settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const saveSettings = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('distraction_blocking')
        .upsert({
          user_id: session.user.id,
          block_type: 'smart',
          pattern_data: settings,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your smart blocking settings have been updated"
      });
    } catch (error) {
      console.error('Error saving smart blocking settings:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Smart Blocking Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Adaptive Mode</Label>
            <p className="text-sm text-muted-foreground">
              Automatically adjust blocking rules based on your productivity patterns
            </p>
          </div>
          <Switch
            checked={settings.adaptiveMode}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, adaptiveMode: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Pattern Learning</Label>
            <p className="text-sm text-muted-foreground">
              Learn from your usage patterns to improve blocking effectiveness
            </p>
          </div>
          <Switch
            checked={settings.learningEnabled}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, learningEnabled: checked }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Productivity Threshold</Label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.productivityThreshold}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              productivityThreshold: parseInt(e.target.value) 
            }))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Lenient</span>
            <span>{settings.productivityThreshold}%</span>
            <span>Strict</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Auto-Adjust Breaks</Label>
            <p className="text-sm text-muted-foreground">
              Automatically adjust break duration based on focus sessions
            </p>
          </div>
          <Switch
            checked={settings.autoAdjust}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, autoAdjust: checked }))}
          />
        </div>

        <Button onClick={saveSettings} className="w-full">
          Save Smart Blocking Settings
        </Button>
      </CardContent>
    </Card>
  );
};