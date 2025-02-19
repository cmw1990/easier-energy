
import { TopNav } from "@/components/layout/TopNav";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export default function DualNBack() {
  const [sequence, setSequence] = useState<{position: number, letter: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [nValue, setNValue] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const generateSequence = () => {
    const newSequence = Array.from({ length: 20 }, () => ({
      position: positions[Math.floor(Math.random() * positions.length)],
      letter: letters[Math.floor(Math.random() * letters.length)]
    }));
    setSequence(newSequence);
    setCurrentIndex(-1);
    setScore(0);
    setIsPlaying(true);
    setCurrentIndex(0);
  };

  const handleResponse = (type: 'position' | 'letter') => {
    if (currentIndex >= nValue) {
      const isMatch = type === 'position' 
        ? sequence[currentIndex].position === sequence[currentIndex - nValue].position
        : sequence[currentIndex].letter === sequence[currentIndex - nValue].letter;
      
      if (isMatch) {
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
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentIndex < sequence.length - 1) {
      timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 3000);
    } else if (isPlaying && currentIndex === sequence.length - 1) {
      setIsPlaying(false);
      saveScore();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, sequence.length]);

  const saveScore = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase.from("brain_game_scores").insert({
        user_id: session.user.id,
        game_type: "dual_n_back",
        score,
        difficulty: nValue,
        duration_seconds: sequence.length * 3
      });

      if (error) throw error;

      toast({
        title: "Score saved!",
        description: `You scored ${score} points at ${nValue}-back level.`,
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
              <h2 className="text-2xl font-bold">Dual N-Back</h2>
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
                    Remember both the position and letter shown N positions back in the sequence.
                    When you see a match, click the corresponding button.
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
                <div className="grid grid-cols-3 gap-2 aspect-square">
                  {positions.map((pos) => (
                    <div
                      key={pos}
                      className={`border rounded-lg flex items-center justify-center text-4xl font-bold
                        ${sequence[currentIndex]?.position === pos ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      {sequence[currentIndex]?.position === pos ? sequence[currentIndex]?.letter : ''}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => handleResponse('position')}
                    variant="outline"
                    size="lg"
                  >
                    Position Match
                  </Button>
                  <Button
                    onClick={() => handleResponse('letter')}
                    variant="outline"
                    size="lg"
                  >
                    Letter Match
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
