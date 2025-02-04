import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Cloud, Loader2, RefreshCw } from "lucide-react";
import { BreathingTechniques, type BreathingTechnique } from "@/components/breathing/BreathingTechniques";
import { GameAssetsGenerator } from "@/components/GameAssetsGenerator";
import Phaser from 'phaser';
import { BalloonScene } from "./scenes/BalloonScene";

const BalloonJourney = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<BalloonScene | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const generateAssets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-balloon-assets', {
        body: { type: 'game-assets' }
      });

      if (error) throw error;

      toast({
        title: "Assets Generated",
        description: "New balloon game assets have been created",
      });
    } catch (error) {
      console.error('Error generating assets:', error);
      toast({
        title: "Error",
        description: "Failed to generate game assets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      if (!gameRef.current) {
        gameRef.current = new Phaser.Game({
          type: Phaser.AUTO,
          parent: 'game-container',
          width: 800,
          height: 400,
          scene: BalloonScene,
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { x: 0, y: 0 },
              debug: false
            }
          }
        });
      }

      sceneRef.current = gameRef.current.scene.getScene('BalloonScene') as BalloonScene;
      setIsPlaying(true);
      
      toast({
        title: "Game Started!",
        description: "Breathe to control your balloon's altitude.",
      });
    } catch (error) {
      console.error("Error starting game:", error);
      toast({
        title: "Error Starting Game",
        description: error.message || "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const endGame = async () => {
    const finalScore = sceneRef.current?.getScore() || 0;
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
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "Balloon Journey",
          duration_minutes: Math.ceil(finalScore / 10),
          focus_rating: Math.min(Math.round((finalScore / 100) * 10), 10),
          energy_rating: null,
          notes: `Completed balloon game with score: ${finalScore}`
        });

        if (error) throw error;

        toast({
          title: "Game Over!",
          description: `Final score: ${finalScore}. Great job!`,
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
    if (sceneRef.current) {
      sceneRef.current.setBreathPhase(breathPhase);
    }
  }, [breathPhase]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Cloud className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Balloon Journey</h2>
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
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {!isPlaying && (
          <div className="w-full max-w-xl mb-4">
            <BreathingTechniques
              onSelectTechnique={setSelectedTechnique}
              className="mb-4"
            />
          </div>
        )}
        
        <div 
          id="game-container"
          className="w-full max-w-3xl aspect-[2/1] bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden"
        />
        
        {!isPlaying ? (
          <Button 
            onClick={startGame}
            className="w-40"
            disabled={isSubmitting || audioSupported === false || !selectedTechnique}
          >
            Start Game
          </Button>
        ) : (
          <Button 
            onClick={endGame}
            variant="outline"
            className="w-40"
            disabled={isSubmitting}
          >
            End Game
          </Button>
        )}
        
        {audioSupported === false && (
          <p className="text-destructive text-sm">
            Audio input is not supported on your device or browser.
            Please try using a different browser or device.
          </p>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>Welcome to Balloon Journey! Control your hot air balloon by breathing:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Breathe in deeply to make your balloon rise</li>
          <li>Breathe out slowly to descend gently</li>
          <li>Avoid obstacles and collect stars</li>
          <li>Follow the breathing pattern for bonus points</li>
          <li>Stay calm and maintain steady breathing</li>
        </ul>
      </div>
    </Card>
  );
};

export default BalloonJourney;