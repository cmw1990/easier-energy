
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TopNav } from "@/components/layout/TopNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

type Problem = {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
};

export default function SpeedMath() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const generateProblem = (): Problem => {
    const operators: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1: number, num2: number, answer: number;

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
      default:
        num1 = 0;
        num2 = 0;
        answer = 0;
    }

    return { num1, num2, operator, answer };
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setCurrentProblem(generateProblem());
  };

  const endGame = async () => {
    setIsPlaying(false);
    
    if (session?.user?.id) {
      try {
        const { error } = await supabase.from("brain_game_scores").insert({
          user_id: session.user.id,
          game_type: "speed_math",
          score,
          duration_seconds: 60,
          metadata: {}
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}`,
        });
      } catch (error) {
        console.error("Error saving score:", error);
        toast({
          title: "Error Saving Score",
          description: "There was a problem saving your score.",
          variant: "destructive",
        });
      }
    }
  };

  const checkAnswer = () => {
    if (!currentProblem) return;

    if (Number(userAnswer) === currentProblem.answer) {
      setScore((prev) => prev + 1);
      toast({
        title: "Correct!",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The answer was ${currentProblem.answer}`,
        variant: "destructive",
      });
    }

    setUserAnswer("");
    setCurrentProblem(generateProblem());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Speed Math</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">Score: {score}</div>
              <div className={`text-lg font-semibold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : ''}`}>
                Time: {timeLeft}s
              </div>
            </div>
          </div>

          {!isPlaying ? (
            <div className="flex flex-col items-center gap-6">
              <p className="text-muted-foreground text-center">
                Solve as many math problems as you can in 60 seconds!
              </p>
              <Button onClick={startGame} size="lg">
                Start Game
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {currentProblem && (
                <>
                  <div className="text-4xl font-bold mb-4">
                    {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-center text-xl w-32"
                      autoFocus
                    />
                    <Button onClick={checkAnswer}>Submit</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
