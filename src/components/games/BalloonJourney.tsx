import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Flame, Loader2 } from "lucide-react";
import { BreathingTechniques, type BreathingTechnique } from "@/components/breathing/BreathingTechniques";
import { useBalloonAssets } from "./BalloonAssets";

const BalloonJourney = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { session } = useAuth();
  const gameLoopRef = useRef<number>();
  const balloonPositionRef = useRef({ x: 100, y: 200 });
  const obstaclesRef = useRef<Array<{ x: number, y: number }>>([]);
  const breathPhaseRef = useRef<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const phaseTimeRef = useRef(0);
  
  const { assets, isLoading, error } = useBalloonAssets();

  // Ensure assets are loaded before starting
  useEffect(() => {
    if (error) {
      console.error("Error loading game assets:", error);
      toast({
        title: "Error Loading Game Assets",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const startGame = () => {
    if (!canvasRef.current || !assets.balloon || !selectedTechnique) {
      toast({
        title: "Please select a breathing technique",
        description: "Choose a breathing technique before starting the game",
        variant: "destructive",
      });
      return;
    }
    
    setIsPlaying(true);
    setScore(0);
    balloonPositionRef.current = { x: 100, y: 200 };
    obstaclesRef.current = [];
    breathPhaseRef.current = 'inhale';
    phaseTimeRef.current = 0;
    gameLoop();
  };

  const gameLoop = () => {
    if (!canvasRef.current || !isPlaying || !selectedTechnique || !assets.balloon) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Update breath phase
    phaseTimeRef.current += 1;
    const { pattern } = selectedTechnique;
    const totalCycleLength = (pattern.inhale + (pattern.hold || 0) + pattern.exhale + (pattern.holdAfterExhale || 0));
    
    if (breathPhaseRef.current === 'inhale' && phaseTimeRef.current >= pattern.inhale) {
      breathPhaseRef.current = pattern.hold ? 'hold' : 'exhale';
      phaseTimeRef.current = 0;
    } else if (breathPhaseRef.current === 'hold' && phaseTimeRef.current >= (pattern.hold || 0)) {
      breathPhaseRef.current = 'exhale';
      phaseTimeRef.current = 0;
    } else if (breathPhaseRef.current === 'exhale' && phaseTimeRef.current >= pattern.exhale) {
      breathPhaseRef.current = pattern.holdAfterExhale ? 'rest' : 'inhale';
      phaseTimeRef.current = 0;
    } else if (breathPhaseRef.current === 'rest' && phaseTimeRef.current >= (pattern.holdAfterExhale || 0)) {
      breathPhaseRef.current = 'inhale';
      phaseTimeRef.current = 0;
    }

    // Update balloon position based on breath phase
    if (breathPhaseRef.current === 'inhale') {
      balloonPositionRef.current.y = Math.max(50, balloonPositionRef.current.y - 2);
    } else if (breathPhaseRef.current === 'exhale') {
      balloonPositionRef.current.y = Math.min(350, balloonPositionRef.current.y + 2);
    }

    // Clear canvas and draw
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
        ) : error ? (
          <div className="text-destructive">
            {error}
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
                disabled={isSubmitting || !selectedTechnique}
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
          <li>Follow the breathing pattern to control your balloon</li>
          <li>Inhale to rise higher</li>
          <li>Exhale to descend</li>
          <li>Hold your breath to maintain position</li>
          <li>Avoid obstacles and mountains</li>
          <li>Collect clouds for extra points</li>
          <li>Enjoy the peaceful journey</li>
        </ul>
      </div>
    </Card>
  );
};

export default BalloonJourney;
