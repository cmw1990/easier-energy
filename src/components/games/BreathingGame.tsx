import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Loader2, RefreshCw } from "lucide-react";
import { usePufferfishAssets } from "./PufferfishAssets";
import { BreathingTechniques, type BreathingTechnique } from "@/components/breathing/BreathingTechniques";
import { usePhaserGame } from "@/hooks/use-phaser-game";
import { PufferfishScene3D } from "./scenes/PufferfishScene3D";
import { GameAssetsGenerator } from "@/components/GameAssetsGenerator";
import { generateBinauralBeat, generateNatureSound } from "@/utils/audioGenerators";

const BreathingGame = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const [soundType, setSoundType] = useState<'binaural' | 'nature'>('binaural');
  const [natureType, setNatureType] = useState<'ocean' | 'rain' | 'wind' | 'forest' | 'thunder' | 'crickets' | 'birds' | 'stream'>('ocean');
  const soundRef = useRef<{ stop: () => void; setVolume: (v: number) => void } | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();
  const { assets, isLoading, generateAssets } = usePufferfishAssets();

  useEffect(() => {
    const checkAudioSupport = async () => {
      try {
        const supported = !!(
          navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia &&
          window.AudioContext
        );
        setAudioSupported(supported);
      } catch (error) {
        console.error("Error checking audio support:", error);
        setAudioSupported(false);
      }
    };
    checkAudioSupport();
  }, []);

  const startGame = async () => {
    if (!selectedTechnique) {
      toast({
        title: "Please select a breathing technique",
        description: "Choose a breathing technique before starting the game",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!audioSupported) {
        throw new Error("Audio input is not supported on this device/browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(audioContextRef.current.destination);

      setIsPlaying(true);
      toast({
        title: "Game Started!",
        description: "Breathe in to make the fish expand and rise, breathe out to shrink and descend.",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error Starting Game",
        description: error.message || "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsSubmitting(true);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "Puffer Fish",
          duration_minutes: Math.ceil(score / 10),
          focus_rating: Math.min(Math.round((score / 100) * 10), 10),
          energy_rating: null,
          notes: `Completed breathing game with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Over!",
          description: `Final score: ${score}. Great job!`,
        });
      } catch (error) {
        console.error("Error saving game results:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your game results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Pufferfish Adventure</h2>
        </div>
        <div className="flex items-center gap-4">
          <GameAssetsGenerator />
          <Button 
            variant="outline"
            onClick={generateAssets}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh Assets
          </Button>
          <div className="text-lg">Score: {score}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading game assets...</span>
          </div>
        ) : (
          <>
            {!isPlaying && (
              <div className="w-full max-w-xl mb-4">
                <BreathingTechniques
                  onSelectTechnique={setSelectedTechnique}
                  className="mb-4"
                />
              </div>
            )}
            
            <div id="game-container" ref={gameContainerRef} className="w-full max-w-3xl">
              <PufferfishScene3D breathPhase={breathPhase} />
            </div>
            
            {!isPlaying && (
              <Button 
                onClick={startGame}
                className="w-40"
                disabled={isSubmitting || audioSupported === false || !selectedTechnique}
              >
                Start Game
              </Button>
            )}
            {audioSupported === false && (
              <p className="text-destructive text-sm">
                Audio input is not supported on your device or browser.
                Please try using a different browser or device.
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>Welcome to Pufferfish Adventure! Control your pufferfish by breathing:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Follow the breathing pattern to control your pufferfish</li>
          <li>Breathe in deeply to inflate and rise</li>
          <li>Breathe out slowly to deflate and descend</li>
          <li>Avoid obstacles and predators</li>
          <li>Collect small fish for extra points</li>
          <li>Create beautiful bubble patterns with your breath</li>
        </ul>
      </div>
    </Card>
  );
};

export default BreathingGame;
