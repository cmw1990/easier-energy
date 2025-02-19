
import { TopNav } from "@/components/layout/TopNav";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

type Puzzle = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const PUZZLES: Puzzle[] = [
  {
    question: "If all A are B, and all B are C, what can we conclude?",
    options: [
      "All A are C",
      "Some A are C",
      "No A are C",
      "Not enough information"
    ],
    answer: 0,
    explanation: "Through transitive property, if all A are B and all B are C, then all A must be C."
  },
  {
    question: "A child is playing with blocks. They have twice as many red blocks as blue blocks, and 3 more blue blocks than green blocks. If they have 6 green blocks, how many red blocks do they have?",
    options: ["30", "18", "24", "15"],
    answer: 1,
    explanation: "Green = 6, Blue = 9 (6 + 3), Red = 18 (9 × 2)"
  },
  // ... Add more puzzles
];

export default function LogicPuzzles() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleAnswer = async (selectedIndex: number) => {
    const isCorrect = selectedIndex === PUZZLES[currentPuzzle].answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Great logical thinking!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try to think it through carefully.",
        variant: "destructive",
      });
    }

    setShowExplanation(true);
  };

  const nextPuzzle = async () => {
    if (currentPuzzle === PUZZLES.length - 1) {
      // Game Over
      try {
        if (session?.user?.id) {
          const { error } = await supabase.from("brain_game_scores").insert({
            user_id: session.user.id,
            game_type: "logic_puzzles",
            score,
            difficulty: 1,
          });

          if (error) throw error;

          toast({
            title: "Game Complete!",
            description: `You got ${score} out of ${PUZZLES.length} correct.`,
          });
        }
      } catch (error) {
        console.error("Error saving score:", error);
        toast({
          title: "Error Saving Score",
          description: "There was a problem saving your progress.",
          variant: "destructive",
        });
      }

      // Reset game
      setCurrentPuzzle(0);
      setScore(0);
    } else {
      setCurrentPuzzle(prev => prev + 1);
    }
    setShowExplanation(false);
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
              <h2 className="text-2xl font-bold">Logic Puzzles</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg">Score: {score}/{PUZZLES.length}</div>
              <div className="text-lg">Puzzle: {currentPuzzle + 1}/{PUZZLES.length}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-6 w-full max-w-2xl">
              <p className="text-xl font-medium">{PUZZLES[currentPuzzle].question}</p>
              
              <div className="grid grid-cols-1 gap-4">
                {PUZZLES[currentPuzzle].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => !showExplanation && handleAnswer(index)}
                    variant={showExplanation ? 
                      (index === PUZZLES[currentPuzzle].answer ? "default" : "outline") 
                      : "outline"
                    }
                    className="p-4 h-auto text-left"
                    disabled={showExplanation}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {showExplanation && (
                <div className="mt-6 space-y-4">
                  <p className="text-muted-foreground">{PUZZLES[currentPuzzle].explanation}</p>
                  <Button onClick={nextPuzzle}>
                    {currentPuzzle === PUZZLES.length - 1 ? "Start Over" : "Next Puzzle"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
