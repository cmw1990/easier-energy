
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Play, Pause, User } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { NoiseControls } from "@/components/audio/NoiseControls";
import { NatureSoundControls } from "@/components/audio/NatureSoundControls";
import { BinauralControls } from "@/components/audio/BinauralControls";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import type { Json } from "@/integrations/supabase/types";

const WhiteNoise = () => {
  const {
    isPlaying,
    settings,
    setSettings,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume
  } = useAudioGenerator();
  
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logSession = async () => {
    if (!user || !sessionStartTime) return;

    try {
      const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
      const { error } = await supabase.from("tool_usage_logs").insert({
        user_id: user.id,
        tool_type: "audio",
        tool_name: "noise_generator",
        session_duration: sessionDuration,
        audio_settings: settings as unknown as Json
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging session:", error);
      toast({
        title: "Error Saving Session",
        description: "There was a problem saving your session data.",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async () => {
    const started = await toggleSound();
    if (started) {
      setSessionStartTime(Date.now());
    } else {
      if (sessionStartTime) {
        await logSession();
        setSessionStartTime(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="h-6 w-6 text-primary" />
                <CardTitle>Advanced Noise Generator</CardTitle>
              </div>
              {!user && (
                <Link to="/auth" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <User className="h-4 w-4" />
                  Sign in to track usage
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleToggle}
                className="w-24 h-24 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12" />
                ) : (
                  <Play className="h-12 w-12" />
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <NoiseControls
                noiseType={settings.noiseType}
                noiseVolume={settings.noiseVolume}
                onNoiseTypeChange={updateNoiseType}
                onVolumeChange={(v) => updateVolume('noise', v)}
              />

              <NatureSoundControls
                natureSoundType={settings.natureSoundType}
                natureSoundVolume={settings.natureSoundVolume}
                onNatureSoundChange={updateNatureSound}
                onVolumeChange={(v) => updateVolume('nature', v)}
              />

              <BinauralControls
                binauralFrequency={settings.binauralFrequency}
                binauralVolume={settings.binauralVolume}
                onFrequencyChange={(freq) => setSettings(prev => ({ ...prev, binauralFrequency: freq }))}
                onVolumeChange={(v) => updateVolume('binaural', v)}
              />
            </div>

            <div className="text-sm text-muted-foreground text-center">
              Mix different types of noise with nature sounds and binaural beats for a personalized ambient soundscape.
              {user && isPlaying && (
                <div className="mt-2 text-primary">
                  Session in progress - your settings are being tracked
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhiteNoise;
