import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain } from "lucide-react";

const COLORS = ["red", "blue", "green", "yellow", "purple"];
const COLOR_CLASSES = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500"
};

const ColorMatch = () => {
  const [word, setWord] = useState("");
  const [color, setColor] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const generateNewPair = () => {
    const newWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    let newColor;
    do {
      newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (newColor === newWord);
    setWord(newWord);
    setColor(newColor);
  };

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(30);
    generateNewPair();
  };

  const handleAnswer = async (matches: boolean) => {
    const isCorrect = (matches && word === color) || (!matches && word !== color);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      generateNewPair();
    } else {
      setScore(prev => Math.max(0, prev - 1));
    }
  };

  const endGame = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "color_match",
          activity_name: "Color Match",
          duration_minutes: 0.5,
          focus_rating: Math.round((score / 30) * 10),
          energy_rating: null,
          notes: `Completed color match with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging color match:", error);
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
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Color Match</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">Score: {score}</div>
          <div className="text-lg">Time: {timeLeft}s</div>
        </div>
      </div>

      {!isActive ? (
        <Button 
          onClick={startGame} 
          className="w-full"
          disabled={isSubmitting}
        >
          Start Game
        </Button>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className={`text-4xl font-bold mb-8 ${COLOR_CLASSES[color as keyof typeof COLOR_CLASSES]}`}>
              {word.toUpperCase()}
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleAnswer(true)}
                variant="outline"
                className="w-32"
                disabled={isSubmitting}
              >
                Matches
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                variant="outline"
                className="w-32"
                disabled={isSubmitting}
              >
                Different
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Does the color of the word match its meaning? Click 'Matches' if it does, 'Different' if it doesn't.
      </div>
    </Card>
  );
};

export default ColorMatch;