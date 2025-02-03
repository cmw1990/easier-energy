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

  useEffect(() => {
    const loadAssets = async () => {
      const assetTypes = ['balloon', 'mountains', 'clouds', 'obstacles', 'background'];
      try {
        const loadedAssets: Partial<GameAssets> = {};
        let loadedCount = 0;

        for (const type of assetTypes) {
          try {
            const { data, error } = await supabase.functions.invoke('generate-game-assets', {
              body: { assetType: type }
            });

            if (error) throw error;
            if (!data?.image) throw new Error('No image data received');

            loadedAssets[type as keyof GameAssets] = `data:image/png;base64,${data.image}`;
            loadedCount++;
          } catch (err) {
            console.error(`Error loading ${type}:`, err);
          }
        }

        setAssets(loadedAssets as GameAssets);
        
        if (loadedCount < assetTypes.length) {
          toast({
            title: "Some Assets Failed to Load",
            description: "The game will work, but some visuals might be missing. Try refreshing.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading game assets:", error);
        toast({
          title: "Error Loading Game Assets",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [toast]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    // Initialize game state and start game loop
    gameLoop();
  };

  const gameLoop = () => {
    if (!canvasRef.current || !isPlaying) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Game logic and rendering
    requestAnimationFrame(gameLoop);
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsSubmitting(true);

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