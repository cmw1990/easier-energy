import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const NumberMemoryGame = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [number, setNumber] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<"showing" | "input" | "result">("showing");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (gameState === "showing") {
      generateNumber();
      const timer = setTimeout(() => {
        setGameState("input");
      }, 2000 + (level * 500)); // Increase showing time with level
      return () => clearTimeout(timer);
    }
  }, [gameState, level]);

  const generateNumber = () => {
    const length = level + 2; // Start with 3 digits and increase
    let num = "";
    for (let i = 0; i < length; i++) {
      num += Math.floor(Math.random() * 10);
    }
    setNumber(num);
    setUserInput("");
  };

  const handleSubmit = () => {
    if (userInput === number) {
      setScore(prev => prev + (level * 10));
      setLevel(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Moving to next level",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The number was ${number}`,
        variant: "destructive",
      });
      saveScore();
      setLevel(1);
      setScore(0);
    }
    setGameState("showing");
  };

  const saveScore = async () => {
    if (!session?.user?.id || score === 0) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("energy_focus_logs").insert({
        user_id: session.user.id,
        activity_type: "brain_game",
        activity_name: "Number Memory",
        duration_minutes: Math.ceil(score / 30),
        focus_rating: Math.min(100, score),
        energy_rating: null,
        notes: `Completed Number Memory with score ${score}`
      });

      if (error) throw error;

      toast({
        title: "Score saved!",
        description: "Your progress has been recorded.",
      });
    } catch (error) {
      console.error("Error saving score:", error);
      toast({
        title: "Error Saving Score",
        description: "There was a problem saving your progress.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameState("showing");
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Number Memory</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">Level: {level}</div>
          <Button 
            onClick={resetGame}
            variant="outline"
            size="icon"
            disabled={isSubmitting}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 my-8">
        {gameState === "showing" && (
          <div className="text-4xl font-bold tracking-wider animate-pulse">
            {number}
          </div>
        )}
        
        {gameState === "input" && (
          <div className="w-full max-w-sm space-y-4">
            <Input
              type="number"
              placeholder="Enter the number you saw"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="text-center text-xl"
              autoFocus
            />
            <Button 
              onClick={handleSubmit}
              className="w-full"
              disabled={!userInput}
            >
              Submit
            </Button>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Remember the number sequence before it disappears
      </div>
    </Card>
  );
};

export default NumberMemoryGame;