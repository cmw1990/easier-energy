
import { TopNav } from "@/components/layout/TopNav";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

type Pattern = number[];

export default function PatternRecognition() {
  const [pattern, setPattern] = useState<Pattern>([]);
  const [options, setOptions] = useState<Pattern[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const { toast } = useToast();
  const { session } = useAuth();

  const generatePattern = () => {
    const length = Math.min(3 + Math.floor(level / 2), 8);
    const newPattern: number[] = [];
    let step = Math.floor(Math.random() * 3) + 1;
    let start = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < length; i++) {
      newPattern.push(start);
      start += step;
    }

    return newPattern;
  };

  const generateOptions = (correctPattern: Pattern) => {
    const options: Pattern[] = [correctPattern];
    
    // Generate wrong options
    while (options.length < 4) {
      const wrongPattern = [...correctPattern];
      const changeIndex = Math.floor(Math.random() * wrongPattern.length);
      wrongPattern[changeIndex] = wrongPattern[changeIndex] + (Math.random() < 0.5 ? 1 : -1);
      
      if (!options.some(opt => JSON.stringify(opt) === JSON.stringify(wrongPattern))) {
        options.push(wrongPattern);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  };

  const startNewRound = () => {
    const newPattern = generatePattern();
    setPattern(newPattern);
    setOptions(generateOptions(newPattern));
  };

  useEffect(() => {
    if (level > 0) {
      startNewRound();
    }
  }, [level]);

  const handleAnswer = (selectedPattern: Pattern) => {
    const isCorrect = JSON.stringify(selectedPattern) === JSON.stringify(pattern);
    
    if (isCorrect) {
      setScore(prev => prev + level * 10);
      setLevel(prev => prev + 1);
      toast({
        title: "Correct!",
        description: `Level ${level} completed.`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try again!",
        variant: "destructive",
      });
      saveScore();
      setLevel(1);
      setScore(0);
    }
  };

  const saveScore = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase.from("brain_game_scores").insert({
        user_id: session.user.id,
        game_type: "pattern_recognition",
        score,
        difficulty: level,
      });

      if (error) throw error;

      toast({
        title: "Score saved!",
        description: `You reached level ${level} with ${score} points.`,
      });
    } catch (error) {
      console.error("Error saving score:", error);
      toast({
        title: "Error Saving Score",
        description: "There was a problem saving your progress.",
        variant: "destructive",
      });
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
              <h2 className="text-2xl font-bold">Pattern Recognition</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg">Level: {level}</div>
              <div className="text-lg">Score: {score}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Study the pattern and select the correct sequence.</p>
              <div className="flex gap-2 justify-center">
                {pattern.map((num, i) => (
                  <div key={i} className="w-10 h-10 flex items-center justify-center border rounded bg-muted">
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {options.map((opt, i) => (
                <Button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  variant="outline"
                  className="h-auto py-4"
                >
                  {opt.join(" → ")}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
