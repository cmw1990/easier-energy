
import { TopNav } from "@/components/layout/TopNav";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];
const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];

export default function StroopTest() {
  const [words, setWords] = useState<{ text: string; color: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const { toast } = useToast();
  const { session } = useAuth();

  const generateWords = () => {
    const newWords = [];
    for (let i = 0; i < 10; i++) {
      const textIndex = Math.floor(Math.random() * COLOR_NAMES.length);
      const colorIndex = Math.floor(Math.random() * COLORS.length);
      newWords.push({
        text: COLOR_NAMES[textIndex],
        color: COLORS[colorIndex],
      });
    }
    return newWords;
  };

  const startGame = () => {
    setWords(generateWords());
    setCurrentIndex(0);
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  const handleAnswer = (colorName: string) => {
    if (colorName === words[currentIndex].color) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        variant: "destructive",
      });
    }

    if (currentIndex === words.length - 1) {
      setIsPlaying(false);
      setRound(prev => prev + 1);
      saveScore();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const saveScore = async () => {
    if (!session?.user?.id) return;

    const timeTaken = (Date.now() - startTime) / 1000;

    try {
      const { error } = await supabase.from("brain_game_scores").insert({
        user_id: session.user.id,
        game_type: "stroop_test",
        score,
        difficulty: round,
        duration_seconds: Math.round(timeTaken)
      });

      if (error) throw error;

      toast({
        title: "Score saved!",
        description: `You got ${score} correct in ${timeTaken.toFixed(1)} seconds.`,
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
              <h2 className="text-2xl font-bold">Stroop Test</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg">Score: {score}</div>
              <div className="text-lg">Round: {round}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            {!isPlaying ? (
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">
                  Click the button that matches the COLOR of the word, not what the word says.
                </p>
                <Button onClick={startGame} size="lg">
                  Start Game
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-4xl font-bold" style={{ color: words[currentIndex].color }}>
                  {words[currentIndex].text}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {COLORS.map((color) => (
                    <Button
                      key={color}
                      onClick={() => handleAnswer(color)}
                      style={{ backgroundColor: color }}
                      className="h-12 text-white hover:opacity-90"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
