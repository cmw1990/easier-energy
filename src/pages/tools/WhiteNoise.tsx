
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Wind, Play, Pause } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { createNoiseBuffer } from "@/utils/audio/createNoiseBuffer";

const WhiteNoise = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [noiseNode, setNoiseNode] = useState<AudioBufferSourceNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([0.5]);

  useEffect(() => {
    // Initialize audio context
    const context = new AudioContext();
    const gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.value = volume[0];
    
    setAudioContext(context);
    setGainNode(gain);

    return () => {
      if (noiseNode) noiseNode.stop();
      context.close();
    };
  }, []);

  const toggleNoise = () => {
    if (!audioContext || !gainNode) return;

    if (isPlaying && noiseNode) {
      noiseNode.stop();
      setNoiseNode(null);
      setIsPlaying(false);
    } else {
      const buffer = createNoiseBuffer(audioContext);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNode);
      source.start();
      setNoiseNode(source);
      setIsPlaying(true);
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
            <div className="flex items-center gap-2">
              <Wind className="h-6 w-6 text-primary" />
              <CardTitle>White Noise Generator</CardTitle>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhiteNoise;
