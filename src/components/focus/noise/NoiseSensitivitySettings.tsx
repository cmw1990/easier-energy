
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Volume2, Waves } from "lucide-react";

export const NoiseSensitivitySettings = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    white_noise_enabled: false,
    volume_level: 50,
    auto_adjust_enabled: false,
    preferred_sounds: [] as string[],
  });

  useEffect(() => {
    if (session?.user) {
      loadSettings();
    }
  }, [session?.user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('noise_sensitivity_settings')
        .select('*')
        .eq('user_id', session?.user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error loading settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const updateSettings = async (newSettings: Partial<typeof settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      const { error } = await supabase
        .from('noise_sensitivity_settings')
        .upsert({
          user_id: session?.user.id,
          ...updatedSettings
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "Settings updated",
        description: "Your noise sensitivity settings have been saved"
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error updating settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-purple-500" />
          Noise Sensitivity Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>White Noise</Label>
              <p className="text-sm text-muted-foreground">
                Enable background white noise
              </p>
            </div>
            <Switch
              checked={settings.white_noise_enabled}
              onCheckedChange={(checked) => updateSettings({ white_noise_enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Volume Level</Label>
              <Waves className="h-4 w-4 text-purple-500" />
            </div>
            <Slider
              value={[settings.volume_level]}
              onValueChange={(value) => updateSettings({ volume_level: value[0] })}
              max={100}
              step={1}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-adjust</Label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust based on environment
              </p>
            </div>
            <Switch
              checked={settings.auto_adjust_enabled}
              onCheckedChange={(checked) => updateSettings({ auto_adjust_enabled: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
