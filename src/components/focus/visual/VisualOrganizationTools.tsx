
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Layout, Grid, List } from "lucide-react";

export const VisualOrganizationTools = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('grid');
  const [colorScheme, setColorScheme] = useState('default');

  const updatePreferences = async () => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('visual_organization_tools')
        .upsert({
          user_id: session.user.id,
          tool_type: 'task_view',
          layout_preferences: { view: activeView },
          color_scheme: [colorScheme]
        });

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your visual organization preferences have been updated"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving preferences",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-green-500" />
          Visual Organization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid View
            </Button>
            <Button
              variant={activeView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={colorScheme === 'default' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setColorScheme('default')}
            >
              Default Colors
            </Button>
            <Button
              variant={colorScheme === 'high-contrast' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setColorScheme('high-contrast')}
            >
              High Contrast
            </Button>
          </div>

          <Button onClick={updatePreferences} className="w-full">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
