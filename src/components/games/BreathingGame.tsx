import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain } from "lucide-react";

interface GameState {
  score: number;
  isPlaying: boolean;
  fishPosition: number;
  obstacles: Array<{
    x: number;
    height: number;
    passed: boolean;
  }>;
}

const BreathingGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isPlaying: false,
    fishPosition: 50,
    obstacles: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const { toast } = useToast();
  const { session } = useAuth();

  // Check audio support on mount
  useEffect(() => {
    const checkAudioSupport = async () => {
      try {
        // Check if the browser supports the required APIs
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
    try {
      if (!audioSupported) {
        throw new Error("Audio input is not supported on this device/browser");
      }

      // Request microphone access with constraints for voice optimization
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

      setGameState(prev => ({ ...prev, isPlaying: true }));
      gameLoop();
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

  const detectBreathing = (): number => {
    if (!analyserRef.current) return 0;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return average;
  };

  const updateGameState = () => {
    const breathingIntensity = detectBreathing();
    
    setGameState(prev => {
      // Update fish position based on breathing
      let newPosition = prev.fishPosition;
      if (breathingIntensity > 50) { // Inhale threshold
        newPosition = Math.max(0, prev.fishPosition - 2);
      } else if (breathingIntensity > 20) { // Exhale threshold
        newPosition = Math.min(100, prev.fishPosition + 2);
      }

      // Update obstacles
      const newObstacles = prev.obstacles
        .map(obs => ({
          ...obs,
          x: obs.x - 2,
          passed: obs.passed || (obs.x < 20 && !obs.passed),
        }))
        .filter(obs => obs.x > -20);

      // Add new obstacles
      if (Math.random() < 0.02) {
        newObstacles.push({
          x: 100,
          height: Math.random() * 60 + 20,
          passed: false,
        });
      }

      // Calculate score
      const newScore = prev.score + newObstacles.filter(obs => obs.x < 20 && !obs.passed).length;

      // Check collisions
      const collision = newObstacles.some(obs => 
        obs.x < 30 && obs.x > 10 && 
        (newPosition < obs.height || newPosition > obs.height + 40)
      );

      if (collision) {
        endGame(newScore);
        return prev;
      }

      return {
        ...prev,
        fishPosition: newPosition,
        obstacles: newObstacles,
        score: newScore,
      };
    });
  };

  const gameLoop = () => {
    if (!canvasRef.current) return;
    
    updateGameState();
    drawGame();
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const drawGame = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 800, 400);

    // Draw fish
    ctx.fillStyle = '#4A90E2';
    ctx.beginPath();
    ctx.arc(100, gameState.fishPosition * 4, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw obstacles
    ctx.fillStyle = '#E24A4A';
    gameState.obstacles.forEach(obstacle => {
      ctx.fillRect(
        obstacle.x * 8,
        0,
        20,
        obstacle.height * 4
      );
      ctx.fillRect(
        obstacle.x * 8,
        (obstacle.height + 40) * 4,
        20,
        400 - (obstacle.height + 40) * 4
      );
    });

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
  };

  const endGame = async (finalScore: number) => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    setIsSubmitting(true);
    
    // Clean up audio resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "Puffer Fish",
          duration_minutes: Math.ceil(finalScore / 10),
          focus_rating: Math.round((finalScore / 100) * 10),
          energy_rating: null,
          notes: `Completed breathing game with score: ${finalScore}`
        });

        if (error) throw error;

        toast({
          title: "Game Over!",
          description: `Final score: ${finalScore}. Great job!`,
        });
      } catch (error) {
        console.error("Error logging breathing game:", error);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
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
          <h2 className="text-2xl font-bold">Breathing Game</h2>
        </div>
        <div className="text-lg">Score: {gameState.score}</div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="border border-gray-200 rounded-lg w-full max-w-3xl"
        />
        
        {!gameState.isPlaying && (
          <>
            <Button 
              onClick={startGame}
              className="w-40"
              disabled={isSubmitting || audioSupported === false}
            >
              Start Game
            </Button>
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
        Breathe in to make the puffer fish rise and expand, breathe out to make it descend and shrink. 
        Avoid the obstacles to score points!
      </div>
    </Card>
  );
};

export default BreathingGame;