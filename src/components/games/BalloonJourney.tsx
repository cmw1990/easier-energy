import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Balloon } from "lucide-react";

interface GameState {
  balloonSize: number;
  balloonY: number;
  obstacles: Array<{
    x: number;
    gapY: number;
    passed: boolean;
  }>;
  score: number;
  isPlaying: boolean;
}

const BalloonJourney = () => {
  const [gameState, setGameState] = useState<GameState>({
    balloonSize: 30,
    balloonY: 200,
    obstacles: [],
    score: 0,
    isPlaying: false,
  });
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      setGameState(prev => ({ ...prev, isPlaying: true }));
      gameLoop();
      
      toast({
        title: "Game Started!",
        description: "Breathe in to inflate the balloon and rise, breathe out to deflate and descend.",
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
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return average;
  };

  const updateGameState = () => {
    const breathingIntensity = detectBreathing();
    
    setGameState(prev => {
      // Update balloon size and position based on breathing
      let newSize = prev.balloonSize;
      let newY = prev.balloonY;
      
      if (breathingIntensity > 50) {
        newSize = Math.min(60, prev.balloonSize + 1);
        newY = Math.max(0, prev.balloonY - 3);
      } else {
        newSize = Math.max(20, prev.balloonSize - 1);
        newY = Math.min(400, prev.balloonY + 2);
      }

      // Update obstacles
      const newObstacles = prev.obstacles
        .map(obs => ({
          ...obs,
          x: obs.x - 2,
          passed: obs.passed || (obs.x < 100 && !obs.passed),
        }))
        .filter(obs => obs.x > -20);

      // Add new obstacles
      if (Math.random() < 0.02) {
        newObstacles.push({
          x: 800,
          gapY: Math.random() * 300 + 50,
          passed: false,
        });
      }

      // Calculate score
      const newScore = prev.score + newObstacles.filter(obs => obs.x < 100 && !obs.passed).length;

      // Check collisions
      const collision = newObstacles.some(obs => 
        obs.x < 120 && obs.x > 80 &&
        (newY < obs.gapY - 40 || newY > obs.gapY + 40)
      );

      if (collision) {
        endGame(newScore);
        return prev;
      }

      return {
        ...prev,
        balloonSize: newSize,
        balloonY: newY,
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

    // Draw balloon
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(100, gameState.balloonY, gameState.balloonSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw string
    ctx.strokeStyle = '#666';
    ctx.beginPath();
    ctx.moveTo(100, gameState.balloonY + gameState.balloonSize);
    ctx.lineTo(100, gameState.balloonY + gameState.balloonSize + 20);
    ctx.stroke();

    // Draw obstacles
    ctx.fillStyle = '#4A90E2';
    gameState.obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, 0, 20, obstacle.gapY - 40);
      ctx.fillRect(obstacle.x, obstacle.gapY + 40, 20, 400 - (obstacle.gapY + 40));
    });

    // Draw score
    ctx.fillStyle = '#000';
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
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "Balloon Journey",
          duration_minutes: Math.ceil(finalScore / 10),
          focus_rating: Math.round((finalScore / 100) * 10),
          energy_rating: null,
          notes: `Completed Balloon Journey game with score: ${finalScore}`
        });

        if (error) throw error;

        toast({
          title: "Game Over!",
          description: `Final score: ${finalScore}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging game:", error);
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
            <Balloon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Balloon Journey</h2>
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
        Control the balloon's inflation and height with your breath. 
        Breathe in to rise and inflate, breathe out to descend and deflate. 
        Navigate through the obstacles to score points!
      </div>
    </Card>
  );
};

export default BalloonJourney;