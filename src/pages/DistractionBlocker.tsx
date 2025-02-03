import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Ban, Globe, Bell, Smartphone, Clock } from "lucide-react";
import { BlockingSchedule } from "@/components/distraction/BlockingSchedule";
import { WebsiteBlocker } from "@/components/distraction/WebsiteBlocker";
import { AppBlocker } from "@/components/distraction/AppBlocker";
import { BlockingStats } from "@/components/distraction/BlockingStats";

const DistractionBlocker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlockingSettings();
  }, [session?.user?.id]);

  const loadBlockingSettings = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('distraction_blocking')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      // Handle the loaded settings
      console.log('Loaded settings:', data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading blocking settings:', error);
      toast({
        title: "Error loading settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Ban className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Distraction Blocker</h1>
      </div>

      <BlockingStats />

      <div className="grid gap-6 md:grid-cols-2">
        <WebsiteBlocker />
        <AppBlocker />
      </div>

      <BlockingSchedule />
    </div>
  );
};

export default DistractionBlocker;