import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface Puzzle {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const LogicPuzzles = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [currentPuzzle, setCurrentPuzzle] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const puzzles: Puzzle[] = [
    {
      question: "If all roses are flowers, and some flowers fade quickly, can we conclude that all roses fade quickly?",
      options: [
        "Yes, because roses are flowers",
        "No, because only some flowers fade quickly",
        "Yes, because all flowers fade",
        "Cannot be determined from the given information"
      ],
      correctAnswer: 3,
      explanation: "This is a logical fallacy. Just because some flowers fade quickly, and all roses are flowers, we cannot conclude that all roses are among the flowers that fade quickly."
    },
    // Add more puzzles here
  ];

  const handleAnswer = async (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const isCorrect = answerIndex === puzzles[currentPuzzle].correctAnswer;

    if (session?.user) {
      try {
        await supabase.from('energy_focus_logs').insert({
          user_id: session.user.id,
          activity_type: 'logic_puzzle',
          activity_name: 'logic_reasoning',
          focus_rating: isCorrect ? 8 : 5,
          duration_minutes: 2,
          notes: `Puzzle ${currentPuzzle + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}`
        });
      } catch (error) {
        console.error('Error saving puzzle result:', error);
      }
    }

    toast({
      title: isCorrect ? "Correct!" : "Not quite right",
      description: isCorrect ? "Great logical thinking!" : "Let's review the explanation",
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Logic Puzzle {currentPuzzle + 1}</h3>
      </div>
      
      <p className="text-muted-foreground mb-6">{puzzles[currentPuzzle].question}</p>

      <div className="space-y-3">
        {puzzles[currentPuzzle].options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === null ? "outline" : 
                    selectedAnswer === index ? 
                      (index === puzzles[currentPuzzle].correctAnswer ? "default" : "destructive") 
                      : "outline"}
            className="w-full justify-start text-left"
            onClick={() => !selectedAnswer && handleAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            <span className="mr-2">
              {selectedAnswer !== null && index === puzzles[currentPuzzle].correctAnswer && (
                <Check className="h-4 w-4 text-green-500 inline" />
              )}
              {selectedAnswer === index && index !== puzzles[currentPuzzle].correctAnswer && (
                <X className="h-4 w-4 text-red-500 inline" />
              )}
            </span>
            {option}
          </Button>
        ))}
      </div>

      {showExplanation && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm">{puzzles[currentPuzzle].explanation}</p>
          {currentPuzzle < puzzles.length - 1 && (
            <Button className="mt-4" onClick={nextPuzzle}>
              Next Puzzle
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default LogicPuzzles;