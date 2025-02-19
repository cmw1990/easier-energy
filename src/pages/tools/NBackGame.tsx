
import { TopNav } from "@/components/layout/TopNav";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const SEQUENCE_LENGTH = 20;
const DISPLAY_TIME = 2000;
const INITIAL_N = 2;

export default function NBackGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [nValue, setNValue] = useState(INITIAL_N);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentIndex < sequence.length - 1) {
      timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, DISPLAY_TIME);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, sequence.length]);

  const generateSequence = () => {
    const newSequence = Array.from({ length: SEQUENCE_LENGTH }, 
      () => Math.floor(Math.random() * 9) + 1
    );
    setSequence(newSequence);
    setCurrentIndex(-1);
    setScore(0);
    setIsPlaying(true);
    setCurrentIndex(0);
  };

  const checkMatch = (isMatch: boolean) => {
    const actualMatch = currentIndex >= nValue && 
      sequence[currentIndex] === sequence[currentIndex - nValue];
    
    if (isMatch === actualMatch) {
      setScore(prev => prev + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => setFeedback(null), 500);
  };

  const saveScore = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase.from("energy_focus_logs").insert({
        user_id: session.user.id,
        activity_type: "brain_game",
        activity_name: "N-Back",
        duration_minutes: Math.ceil(SEQUENCE_LENGTH * (DISPLAY_TIME / 1000) / 60),
        focus_rating: Math.min(Math.round((score / SEQUENCE_LENGTH) * 10), 10),
        energy_rating: null,
        notes: `Completed N-Back (n=${nValue}) with score ${score}/${SEQUENCE_LENGTH}`
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
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    saveScore();
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
              <h2 className="text-2xl font-bold">N-Back Test</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg">Score: {score}</div>
              <div className="text-lg">N = {nValue}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            {!isPlaying ? (
              <>
                <div className="space-y-4 text-center">
                  <p className="text-muted-foreground">
                    Remember the number shown N positions back in the sequence.
                    When you see a number, indicate if it matches the number shown {nValue} positions ago.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setNValue(prev => Math.max(1, prev - 1))}
                      variant="outline"
                    >
                      Decrease N
                    </Button>
                    <Button
                      onClick={() => setNValue(prev => prev + 1)}
                      variant="outline"
                    >
                      Increase N
                    </Button>
                  </div>
                </div>
                <Button onClick={generateSequence} size="lg">
                  Start Game
                </Button>
              </>
            ) : (
              <div className="space-y-8 w-full max-w-md">
                <div 
                  className={`text-8xl font-bold text-center p-8 rounded-lg transition-all
                    ${feedback === "correct" ? "text-green-500 scale-110" : 
                      feedback === "incorrect" ? "text-red-500 scale-95" : ""}`}
                >
                  {sequence[currentIndex]}
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => checkMatch(true)}
                    variant="outline"
                    size="lg"
                  >
                    Match
                  </Button>
                  <Button
                    onClick={() => checkMatch(false)}
                    variant="outline"
                    size="lg"
                  >
                    No Match
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground">
              <p>This game tests and improves your working memory.</p>
              <ul className="list-disc list-inside mt-2">
                <li>Watch the sequence of numbers</li>
                <li>Remember the number shown {nValue} positions ago</li>
                <li>Click "Match" if the current number matches the number from {nValue} positions back</li>
                <li>Click "No Match" if they're different</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
