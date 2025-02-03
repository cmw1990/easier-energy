import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Circle } from "lucide-react";

interface GameAssets {
  balloon: string;
  mountains: string;
  clouds: string[];
  obstacles: string[];
  background: string;
}

interface GameState {
  balloonSize: number;
  balloonY: number;
  obstacles: Array<{
    x: number;
    gapY: number;
    passed: boolean;
    image: string;
  }>;
  clouds: Array<{
    x: number;
    y: number;
    speed: number;
    image: string;
  }>;
  score: number;
  isPlaying: boolean;
  mountainOffset: number;
}

const BalloonJourney = () => {
  const [gameState, setGameState] = useState<GameState>({
    balloonSize: 30,
    balloonY: 200,
    obstacles: [],
    clouds: [],
    score: 0,
    isPlaying: false,
    mountainOffset: 0,
  });
  const [assets, setAssets] = useState<GameAssets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const { toast } = useToast();
  const { session } = useAuth();

  const loadGameAssets = async () => {
    try {
      const assetTypes = ['balloon', 'mountains', 'clouds', 'obstacles', 'background'];
      const loadedAssets: Partial<GameAssets> = {
        clouds: [],
        obstacles: [],
      };

      for (const assetType of assetTypes) {
        const { data, error } = await supabase.functions.invoke('generate-game-assets', {
          body: { assetType }
        });

        if (error) throw error;

        if (assetType === 'clouds' || assetType === 'obstacles') {
          loadedAssets[assetType]?.push(data.image);
        } else {
          loadedAssets[assetType as keyof GameAssets] = data.image;
        }
      }

      setAssets(loadedAssets as GameAssets);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading game assets:', error);
      toast({
        title: "Error Loading Assets",
        description: "Failed to load game assets. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadGameAssets();
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

      setGameState(prev => ({
        ...prev,
        isPlaying: true,
        obstacles: [],
        clouds: Array(3).fill(null).map(() => ({
          x: Math.random() * 800,
          y: Math.random() * 400,
          speed: 0.5 + Math.random(),
          image: assets?.clouds[0] || '',
        })),
        score: 0,
        mountainOffset: 0,
      }));
      
      gameLoop();
      
      toast({
        title: "Adventure Begins!",
        description: "Breathe in to rise and inflate, breathe out to descend. Journey through the peaceful mountains.",
      });
    } catch (error) {
      console.error("Error starting game:", error);
      toast({
        title: "Error Starting Journey",
        description: error.message || "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
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

      // Update mountain scroll
      const newMountainOffset = (prev.mountainOffset - 1) % 800;

      // Update clouds
      const newClouds = prev.clouds.map(cloud => ({
        ...cloud,
        x: cloud.x - cloud.speed,
        y: cloud.y + Math.sin(Date.now() / 1000) * 0.5,
      })).map(cloud => cloud.x < -100 ? {
        ...cloud,
        x: 900,
        y: Math.random() * 400,
      } : cloud);

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
          image: assets?.obstacles[0] || '',
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
        clouds: newClouds,
        score: newScore,
        mountainOffset: newMountainOffset,
      };
    });
  };

  const drawGame = () => {
    if (!canvasRef.current || !assets) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 800, 400);

    // Draw background
    const backgroundImage = new Image();
    backgroundImage.src = `data:image/png;base64,${assets.background}`;
    ctx.drawImage(backgroundImage, 0, 0, 800, 400);

    // Draw mountains (parallax scrolling)
    const mountainImage = new Image();
    mountainImage.src = `data:image/png;base64,${assets.mountains}`;
    ctx.drawImage(mountainImage, gameState.mountainOffset, 100, 800, 300);
    ctx.drawImage(mountainImage, gameState.mountainOffset + 800, 100, 800, 300);

    // Draw clouds
    gameState.clouds.forEach(cloud => {
      const cloudImage = new Image();
      cloudImage.src = `data:image/png;base64,${cloud.image}`;
      ctx.drawImage(cloudImage, cloud.x, cloud.y, 100, 60);
    });

    // Draw obstacles
    gameState.obstacles.forEach(obstacle => {
      const obstacleImage = new Image();
      obstacleImage.src = `data:image/png;base64,${obstacle.image}`;
      ctx.drawImage(obstacleImage, obstacle.x, 0, 20, obstacle.gapY - 40);
      ctx.drawImage(obstacleImage, obstacle.x, obstacle.gapY + 40, 20, 400 - (obstacle.gapY + 40));
    });

    // Draw balloon
    const balloonImage = new Image();
    balloonImage.src = `data:image/png;base64,${assets.balloon}`;
    ctx.drawImage(
      balloonImage,
      70,
      gameState.balloonY - gameState.balloonSize,
      gameState.balloonSize * 2,
      gameState.balloonSize * 2
    );

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
  };

  const detectBreathing = (): number => {
    if (!analyserRef.current) return 0;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return average;
  };

  const gameLoop = () => {
    if (!canvasRef.current) return;
    
    updateGameState();
    drawGame();
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const endGame = async (finalScore: number) => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    
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
          focus_rating: null,
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
            <Circle className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Balloon Journey</h2>
        </div>
        <div className="text-lg">Score: {gameState.score}</div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {isLoading ? (
          <div className="text-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
            <p>Loading your adventure...</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="border border-gray-200 rounded-lg w-full max-w-3xl"
            />
            
            {!gameState.isPlaying && (
              <Button 
                onClick={startGame}
                className="w-40"
                disabled={audioSupported === false}
              >
                Begin Journey
              </Button>
            )}
          </>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Embark on a peaceful journey through serene mountains and clouds. 
        Control your magical balloon with your breath - inhale to rise and inflate, 
        exhale to descend and glide through the tranquil landscape.
      </div>
    </Card>
  );
};

export default BalloonJourney;
