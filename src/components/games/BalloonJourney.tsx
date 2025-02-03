import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Flame, Loader2 } from "lucide-react";

interface GameAssets {
  balloon: string;
  mountains: string;
  clouds: string;
  obstacles: string;
  background: string;
}

const BalloonJourney = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [assets, setAssets] = useState<GameAssets>({} as GameAssets);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { session } = useAuth();
  const gameLoopRef = useRef<number>();
  const balloonPositionRef = useRef({ x: 100, y: 200 });
  const obstaclesRef = useRef<Array<{ x: number, y: number }>>([]);

  useEffect(() => {
    const loadAssets = async () => {
      const assetTypes = ['balloon', 'mountains', 'clouds', 'obstacles', 'background'];
      try {
        const loadedAssets: Partial<GameAssets> = {};
        let loadedCount = 0;

        for (const type of assetTypes) {
          try {
            console.log(`Loading ${type} from game-assets storage`);
            const { data: publicUrl } = await supabase
              .storage
              .from('game-assets')
              .getPublicUrl(`balloon/${type}.png`);

            if (!publicUrl.publicUrl) {
              throw new Error('No public URL received');
            }

            // Pre-load the image to ensure it's cached
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = publicUrl.publicUrl;
            });

            loadedAssets[type as keyof GameAssets] = publicUrl.publicUrl;
            loadedCount++;
          } catch (err) {
            console.error(`Error loading ${type}:`, err);
            // Use placeholder for failed assets
            loadedAssets[type as keyof GameAssets] = '/placeholder.svg';
          }
        }

        if (Object.keys(loadedAssets).length === assetTypes.length) {
          setAssets(loadedAssets as GameAssets);
          setIsLoading(false);
        } else {
          throw new Error('Failed to load all assets');
        }
      } catch (error) {
        console.error("Error loading game assets:", error);
        toast({
          title: "Error Loading Game Assets",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        });
      }
    };

    loadAssets();

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [toast]);

  const startGame = () => {
    if (!canvasRef.current || !assets.balloon) return;
    
    setIsPlaying(true);
    setScore(0);
    balloonPositionRef.current = { x: 100, y: 200 };
    obstaclesRef.current = [];
    gameLoop();
  };

  const gameLoop = () => {
    if (!canvasRef.current || !isPlaying) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw background
    if (assets.background) {
      const bgImage = new Image();
      bgImage.src = assets.background;
      ctx.drawImage(bgImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    // Draw balloon
    if (assets.balloon) {
      const balloonImage = new Image();
      balloonImage.src = assets.balloon;
      ctx.drawImage(
        balloonImage,
        balloonPositionRef.current.x,
        balloonPositionRef.current.y,
        50,
        70
      );
    }

    // Update score
    setScore(prev => prev + 1);

    // Request next frame
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsSubmitting(true);

    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "Balloon Journey",
          duration_minutes: Math.ceil(score / 10),
          focus_rating: Math.min(Math.round((score / 100) * 10), 10),
          energy_rating: null,
          notes: `Completed balloon journey with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Journey Complete!",
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

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Balloon Journey</h2>
        </div>
        <div className="text-lg">Score: {score}</div>
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
            
            {!isPlaying && (
              <Button 
                onClick={startGame}
                className="w-40"
                disabled={isSubmitting}
              >
                Start Journey
              </Button>
            )}
          </>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>Welcome to Balloon Journey! Control your hot air balloon through beautiful landscapes:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Breathe in to rise higher</li>
          <li>Breathe out to descend</li>
          <li>Avoid obstacles and mountains</li>
          <li>Collect clouds for extra points</li>
          <li>Enjoy the peaceful journey</li>
        </ul>
      </div>
    </Card>
  );
};

export default BalloonJourney;