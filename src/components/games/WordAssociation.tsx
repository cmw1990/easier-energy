import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Star } from "lucide-react";

const WORD_PAIRS = [
  { word: "SKY", related: ["CLOUD", "BIRD", "SUN"], unrelated: ["SHOE", "FORK", "DESK"] },
  { word: "BOOK", related: ["PAGE", "READ", "STORY"], unrelated: ["SWIM", "DANCE", "JUMP"] },
  { word: "TREE", related: ["LEAF", "ROOT", "BRANCH"], unrelated: ["PHONE", "PLATE", "CHAIR"] },
  { word: "FIRE", related: ["HEAT", "FLAME", "SMOKE"], unrelated: ["ICE", "SNOW", "FROST"] },
];

const WordAssociation = () => {
  const [currentPair, setCurrentPair] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
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

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(30);
    setCurrentPair(0);
    generateOptions(0);
  };

  const generateOptions = (pairIndex: number) => {
    const pair = WORD_PAIRS[pairIndex];
    const allOptions = [...pair.related, ...pair.unrelated];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleOptionClick = (option: string) => {
    const pair = WORD_PAIRS[currentPair];
    const isRelated = pair.related.includes(option);
    
    if (isRelated) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Good association!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try another word",
        variant: "destructive",
      });
    }

    const nextPair = (currentPair + 1) % WORD_PAIRS.length;
    setCurrentPair(nextPair);
    generateOptions(nextPair);
  };

  const endGame = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "word_association",
          activity_name: "Word Association",
          duration_minutes: 0.5,
          focus_rating: Math.round((score / 15) * 10),
          energy_rating: null,
          notes: `Completed word association with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging word association:", error);
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
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Star className="h-5 w-5 text-primary animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold">Word Association</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">Score: {score}</div>
          <div className="text-lg">Time: {timeLeft}s</div>
        </div>
      </div>

      {!isActive ? (
        <Button 
          onClick={startGame} 
          className="w-full animate-pulse"
          disabled={isSubmitting}
        >
          Start Game
        </Button>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-8 animate-float">
              {WORD_PAIRS[currentPair].word}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  variant="outline"
                  className="h-16 text-xl hover:scale-105 transition-transform"
                  disabled={isSubmitting}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Click on words that are most closely related to the main word. Score points for correct associations.
      </div>
    </Card>
  );
};

export default WordAssociation;