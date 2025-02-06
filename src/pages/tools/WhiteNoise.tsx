
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Wind, Play, Pause, User, Volume2, Waves, Music2 } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { createNoiseBuffer } from "@/utils/audio/createNoiseBuffer";
import { generateBinauralBeat, generateNatureSound } from "@/utils/audio";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import type { NatureSound } from "@/utils/audio/natureTypes";

interface AudioState {
  noise: AudioBufferSourceNode | null;
  nature: ReturnType<typeof generateNatureSound> | null;
  binaural: ReturnType<typeof generateBinauralBeat> | null;
}

interface AudioSettings {
  noiseType: 'white' | 'pink' | 'brown' | 'off';
  noiseVolume: number;
  natureSoundType: NatureSound | null;
  natureSoundVolume: number;
  binauralFrequency: number | null;
  binauralVolume: number;
}

const WhiteNoise = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    noise: null,
    nature: null,
    binaural: null
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>({
    noiseType: 'white',
    noiseVolume: 0.5,
    natureSoundType: null,
    natureSoundVolume: 0,
    binauralFrequency: null,
    binauralVolume: 0
  });
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const initAudio = async () => {
      const context = new AudioContext();
      const gain = context.createGain();
      gain.connect(context.destination);
      gain.gain.value = settings.noiseVolume;
      
      setAudioContext(context);
      setGainNode(gain);
    };

    initAudio();

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      stopAllSounds();
      if (audioContext) {
        audioContext.close();
      }
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
        tool_name: "noise_generator",
        session_duration: sessionDuration,
        audio_settings: settings
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

  const stopAllSounds = () => {
    if (audioState.noise) {
      audioState.noise.stop();
    }
    if (audioState.nature) {
      audioState.nature.stop();
    }
    if (audioState.binaural) {
      audioState.binaural.stop();
    }
    setAudioState({ noise: null, nature: null, binaural: null });
  };

  const toggleSound = async () => {
    if (!audioContext || !gainNode) return;

    if (isPlaying) {
      stopAllSounds();
      setIsPlaying(false);
      if (sessionStartTime) {
        await logSession();
        setSessionStartTime(null);
      }
    } else {
      const newState: AudioState = { noise: null, nature: null, binaural: null };

      // Generate noise if selected
      if (settings.noiseType !== 'off' && settings.noiseVolume > 0) {
        const buffer = createNoiseBuffer(audioContext, settings.noiseType);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const noiseGain = audioContext.createGain();
        noiseGain.gain.value = settings.noiseVolume;
        source.connect(noiseGain);
        noiseGain.connect(gainNode);
        
        source.start();
        newState.noise = source;
      }

      // Add nature sounds if selected
      if (settings.natureSoundType && settings.natureSoundVolume > 0) {
        const natureSound = generateNatureSound(settings.natureSoundType, settings.natureSoundVolume);
        newState.nature = natureSound;
      }

      // Add binaural beats if frequency is set
      if (settings.binauralFrequency && settings.binauralVolume > 0) {
        const binauralBeat = generateBinauralBeat(432, settings.binauralFrequency, settings.binauralVolume);
        newState.binaural = binauralBeat;
      }

      setAudioState(newState);
      setIsPlaying(true);
      setSessionStartTime(Date.now());
    }
  };

  const updateNoiseType = (type: AudioSettings['noiseType']) => {
    if (isPlaying) {
      stopAllSounds();
      setIsPlaying(false);
    }
    setSettings(prev => ({ ...prev, noiseType: type }));
  };

  const updateNatureSound = (type: NatureSound | null) => {
    if (audioState.nature) {
      audioState.nature.stop();
    }
    setSettings(prev => ({ ...prev, natureSoundType: type }));
  };

  const updateVolume = (type: 'noise' | 'nature' | 'binaural', value: number[]) => {
    const newVolume = value[0];
    
    setSettings(prev => ({
      ...prev,
      [`${type}Volume`]: newVolume
    }));

    if (isPlaying) {
      switch (type) {
        case 'noise':
          if (gainNode) {
            gainNode.gain.value = newVolume;
          }
          break;
        case 'nature':
          if (audioState.nature) {
            audioState.nature.setVolume(newVolume);
          }
          break;
        case 'binaural':
          if (audioState.binaural) {
            audioState.binaural.setVolume(newVolume);
          }
          break;
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
                onClick={toggleSound}
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
              <div className="flex flex-wrap gap-2">
                {(['white', 'pink', 'brown', 'off'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={settings.noiseType === type ? "default" : "outline"}
                    onClick={() => updateNoiseType(type)}
                    className="capitalize"
                  >
                    {type} Noise
                  </Button>
                ))}
              </div>

              {settings.noiseType !== 'off' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Noise Volume</span>
                  </div>
                  <Slider
                    value={[settings.noiseVolume]}
                    onValueChange={(v) => updateVolume('noise', v)}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Music2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Nature Sounds</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(['rain', 'ocean', 'forest', 'stream', 'wind'] as NatureSound[]).map((type) => (
                    <Button
                      key={type}
                      variant={settings.natureSoundType === type ? "default" : "outline"}
                      onClick={() => updateNatureSound(type)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                  <Button
                    variant={settings.natureSoundType === null ? "default" : "outline"}
                    onClick={() => updateNatureSound(null)}
                  >
                    Off
                  </Button>
                </div>
                {settings.natureSoundType && (
                  <Slider
                    value={[settings.natureSoundVolume]}
                    onValueChange={(v) => updateVolume('nature', v)}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  <span className="text-sm font-medium">Binaural Beats</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[4, 8, 12, 16].map((freq) => (
                    <Button
                      key={freq}
                      variant={settings.binauralFrequency === freq ? "default" : "outline"}
                      onClick={() => setSettings(prev => ({ ...prev, binauralFrequency: freq }))}
                    >
                      {freq}Hz
                    </Button>
                  ))}
                  <Button
                    variant={settings.binauralFrequency === null ? "default" : "outline"}
                    onClick={() => setSettings(prev => ({ ...prev, binauralFrequency: null }))}
                  >
                    Off
                  </Button>
                </div>
                {settings.binauralFrequency && (
                  <Slider
                    value={[settings.binauralVolume]}
                    onValueChange={(v) => updateVolume('binaural', v)}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                )}
              </div>
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
