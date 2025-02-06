
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Wind, Play, Pause, User } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { createNoiseBuffer } from "@/utils/audio/createNoiseBuffer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const WhiteNoise = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [noiseNode, setNoiseNode] = useState<AudioBufferSourceNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([0.5]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize audio context
    const context = new AudioContext();
    const gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.value = volume[0];
    
    setAudioContext(context);
    setGainNode(gain);

    // Check authentication status
    const { data: { session } } = supabase.auth.getSession();
    setUser(session?.user || null);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      if (noiseNode) noiseNode.stop();
      context.close();
      subscription.unsubscribe();
    };
  }, []);

  const logSession = async () => {
    if (!user || !sessionStartTime) return;

    try {
      const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
      const { error } = await supabase.from("tool_usage_logs").insert({
        user_id: user.id,
        tool_type: "audio",
        tool_name: "white_noise",
        session_duration: sessionDuration,
        settings: { volume: volume[0] }
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

  const toggleNoise = async () => {
    if (!audioContext || !gainNode) return;

    if (isPlaying && noiseNode) {
      noiseNode.stop();
      setNoiseNode(null);
      setIsPlaying(false);
      if (sessionStartTime) {
        await logSession();
        setSessionStartTime(null);
      }
    } else {
      const buffer = createNoiseBuffer(audioContext);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNode);
      source.start();
      setNoiseNode(source);
      setIsPlaying(true);
      setSessionStartTime(Date.now());
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (gainNode) {
      gainNode.gain.value = newVolume[0];
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
                <CardTitle>White Noise Generator</CardTitle>
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
                onClick={toggleNoise}
                className="w-24 h-24 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12" />
                ) : (
                  <Play className="h-12 w-12" />
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Volume</label>
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            <div className="text-sm text-muted-foreground text-center">
              White noise can help mask distracting sounds and improve focus.
              Use the slider to adjust the volume to a comfortable level.
              {user && isPlaying && (
                <div className="mt-2 text-primary">
                  Session in progress - your usage is being tracked
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
