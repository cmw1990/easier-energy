import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain } from "lucide-react";

const COLORS = ["red", "blue", "green", "yellow"];
const COLOR_CLASSES = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500"
};

const SimonSays = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isShowingSequence && sequence.length > 0) {
      let i = 0;
      const showNext = () => {
        if (i < sequence.length) {
          // Flash the color
          const button = document.getElementById(`simon-${sequence[i]}`);
          if (button) {
            button.classList.add("opacity-100");
            setTimeout(() => {
              button.classList.remove("opacity-100");
              i++;
              timeout = setTimeout(showNext, 800);
            }, 500);
          }
        } else {
          setIsShowingSequence(false);
        }
      };
      timeout = setTimeout(showNext, 1000);
    }
    return () => clearTimeout(timeout);
  }, [isShowingSequence, sequence]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    addToSequence();
  };

  const addToSequence = () => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence(prev => [...prev, newColor]);
    setUserSequence([]);
    setIsShowingSequence(true);
  };

  const handleColorClick = (color: string) => {
    if (isShowingSequence) return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    const isCorrect = newUserSequence.every(
      (c, i) => c === sequence[i]
    );

    if (!isCorrect) {
      endGame();
    } else if (newUserSequence.length === sequence.length) {
      setScore(prev => prev + 1);
      setTimeout(addToSequence, 1000);
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "simon_says",
          activity_name: "Simon Says",
          duration_minutes: Math.ceil(score / 2),
          focus_rating: Math.round((score / 10) * 10),
          energy_rating: null,
          notes: `Completed Simon Says with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Over!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging Simon Says:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your game results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setSequence([]);
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full animate-shimmer">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Simon Says</h2>
        </div>
        <div className="text-lg">Score: {score}</div>
      </div>

      {!isPlaying ? (
        <Button 
          onClick={startGame} 
          className="w-full animate-pulse"
          disabled={isSubmitting}
        >
          Start Game
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {COLORS.map((color) => (
            <Button
              key={color}
              id={`simon-${color}`}
              onClick={() => handleColorClick(color)}
              className={`h-24 transition-all duration-300 opacity-60 hover:opacity-100 ${COLOR_CLASSES[color as keyof typeof COLOR_CLASSES]} ${
                isShowingSequence ? 'animate-breathe' : ''
              }`}
              disabled={isShowingSequence || isSubmitting}
            />
          ))}
        </div>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Watch the sequence of colors and repeat it by clicking the buttons in the same order.
      </div>
    </Card>
  );
};

export default SimonSays;