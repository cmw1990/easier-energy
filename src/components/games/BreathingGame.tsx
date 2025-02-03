import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Loader2 } from "lucide-react";
import { usePufferfishAssets } from "./PufferfishAssets";

interface GameState {
  score: number;
  isPlaying: boolean;
  fishPosition: number;
  fishSize: number;
  obstacles: Array<{
    x: number;
    y: number;
    type: 'coral' | 'seaweed' | 'predator' | 'smallFish';
    passed: boolean;
  }>;
  bubbles: Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
  }>;
}

const BreathingGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isPlaying: false,
    fishPosition: 50,
    fishSize: 1,
    obstacles: [],
    bubbles: [],
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
  const { assets, isLoading } = usePufferfishAssets();

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
      // Update fish size based on breathing
      let newSize = prev.fishSize;
      if (breathingIntensity > 50) { // Inhale
        newSize = Math.min(1.5, prev.fishSize + 0.05);
      } else if (breathingIntensity > 20) { // Exhale
        newSize = Math.max(0.8, prev.fishSize - 0.05);
      }

      // Update fish position based on size (bigger = float up, smaller = sink down)
      let newPosition = prev.fishPosition;
      if (newSize > 1.2) {
        newPosition = Math.max(0, prev.fishPosition - 2);
      } else if (newSize < 1) {
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
        const types: Array<'coral' | 'seaweed' | 'predator' | 'smallFish'> = 
          ['coral', 'seaweed', 'predator', 'smallFish'];
        newObstacles.push({
          x: 100,
          y: Math.random() * 80 + 10,
          type: types[Math.floor(Math.random() * types.length)],
          passed: false,
        });
      }

      // Update bubbles
      const newBubbles = [...prev.bubbles]
        .map(bubble => ({
          ...bubble,
          y: bubble.y - bubble.speed,
          x: bubble.x + Math.sin(bubble.y / 30) * 0.5,
        }))
        .filter(bubble => bubble.y > -10);

      // Add new bubbles
      if (Math.random() < 0.1) {
        newBubbles.push({
          x: Math.random() * 100,
          y: 110,
          size: Math.random() * 20 + 10,
          speed: Math.random() * 2 + 1,
        });
      }

      // Calculate score based on obstacles passed and fish control
      const newScore = prev.score + 
        newObstacles.filter(obs => obs.x < 20 && !obs.passed).length +
        (Math.abs(1 - newSize) < 0.1 ? 0.1 : 0); // Bonus for maintaining neutral size

      // Check collisions
      const collision = newObstacles.some(obs => {
        const hitbox = obs.type === 'predator' ? 15 : 10;
        return (
          obs.x < 30 && obs.x > 10 &&
          Math.abs(newPosition - obs.y) < hitbox * newSize
        );
      });

      if (collision) {
        endGame(newScore);
        return prev;
      }

      return {
        ...prev,
        fishPosition: newPosition,
        fishSize: newSize,
        obstacles: newObstacles,
        bubbles: newBubbles,
        score: Math.floor(newScore),
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
    if (!canvasRef.current || !assets.background) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear and draw background
    ctx.clearRect(0, 0, 800, 400);
    const bgImage = new Image();
    bgImage.src = assets.background;
    ctx.drawImage(bgImage, 0, 0, 800, 400);

    // Draw bubbles
    if (assets.bubbles) {
      const bubbleImage = new Image();
      bubbleImage.src = assets.bubbles;
      gameState.bubbles.forEach(bubble => {
        ctx.drawImage(
          bubbleImage,
          bubble.x * 8 - bubble.size/2,
          bubble.y * 4 - bubble.size/2,
          bubble.size,
          bubble.size
        );
      });
    }

    // Draw obstacles
    gameState.obstacles.forEach(obstacle => {
      if (assets[obstacle.type]) {
        const obstacleImage = new Image();
        obstacleImage.src = assets[obstacle.type];
        const size = obstacle.type === 'predator' ? 60 : 40;
        ctx.drawImage(
          obstacleImage,
          obstacle.x * 8 - size/2,
          obstacle.y * 4 - size/2,
          size,
          size
        );
      }
    });

    // Draw pufferfish
    if (assets.pufferfish) {
      const fishImage = new Image();
      fishImage.src = assets.pufferfish;
      const fishSize = 40 * gameState.fishSize;
      ctx.drawImage(
        fishImage,
        100 - fishSize/2,
        gameState.fishPosition * 4 - fishSize/2,
        fishSize,
        fishSize
      );
    }

    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
  };

  const endGame = async (finalScore: number) => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    setIsSubmitting(true);
    
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
        // Normalize score to 0-100 range first
        const normalizedScore = Math.min(Math.max(finalScore, 0), 100);
        // Then convert to 0-10 range and ensure it's an integer
        const focusRating = Math.min(Math.round((normalizedScore / 100) * 10), 10);

        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "Puffer Fish",
          duration_minutes: Math.ceil(finalScore / 10),
          focus_rating: focusRating,
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
          <h2 className="text-2xl font-bold">Pufferfish Adventure</h2>
        </div>
        <div className="text-lg">Score: {gameState.score}</div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading game assets...</span>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="border border-gray-200 rounded-lg w-full max-w-3xl bg-blue-50"
            />
            
            {!gameState.isPlaying && (
              <Button 
                onClick={startGame}
                className="w-40"
                disabled={isSubmitting || audioSupported === false}
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
