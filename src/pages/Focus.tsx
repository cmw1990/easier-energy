import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Target, Puzzle, GamepadIcon } from "lucide-react";
import MemoryCards from "@/components/games/MemoryCards";
import PatternMatch from "@/components/games/PatternMatch";
import WordScramble from "@/components/games/WordScramble";
import ColorMatch from "@/components/games/ColorMatch";
import MathSpeed from "@/components/games/MathSpeed";
import SimonSays from "@/components/games/SimonSays";
import SpeedTyping from "@/components/games/SpeedTyping";
import VisualMemory from "@/components/games/VisualMemory";

const NumberSequence = () => {
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<number[]>([]);
  const [currentTarget, setCurrentTarget] = useState<number | null>(null);
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
      endTest();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTest = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(30);
    generateNewTarget();
    toast({
      title: "Focus Test Started",
      description: "Click the highlighted numbers in ascending order.",
    });
  };

  const generateNewTarget = () => {
    const newTargets = Array.from({ length: 9 }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5);
    setTargets(newTargets);
    setCurrentTarget(1);
  };

  const handleNumberClick = (number: number) => {
    if (!isActive || number !== currentTarget) return;

    setScore((prev) => prev + 1);
    if (currentTarget === 9) {
      generateNewTarget();
    } else {
      setCurrentTarget((prev) => (prev || 0) + 1);
    }
  };

  const endTest = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "focus_test",
          activity_name: "Number Sequence",
          duration_minutes: 0.5,
          focus_rating: Math.round((score / 45) * 10),
          energy_rating: null,
          notes: `Completed focus test with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Test Complete!",
          description: `Your score: ${score}. Great job!`,
        });
      } catch (error) {
        console.error("Error logging focus test:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your test results.",
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
            <Puzzle className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Number Sequence</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-medium">Score: {score}</div>
          <div className="text-lg font-medium">Time: {timeLeft}s</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {targets.map((number, index) => (
          <Button
            key={`${number}-${index}`}
            onClick={() => handleNumberClick(number)}
            variant={number === currentTarget ? "default" : "outline"}
            className={`h-16 text-xl font-bold transition-all ${
              number === currentTarget ? 'ring-2 ring-primary ring-offset-2' : ''
            } ${!isActive || number !== currentTarget ? 'opacity-80' : ''}`}
            disabled={!isActive || number !== currentTarget || isSubmitting}
          >
            {number}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {!isActive ? (
          <Button 
            onClick={startTest} 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            Start Test
          </Button>
        ) : (
          <Button 
            variant="destructive" 
            onClick={endTest} 
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            End Test
          </Button>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Click numbers in ascending order (1-9). Complete as many sequences as possible in 30 seconds.
      </div>
    </Card>
  );
};

const Focus = () => {
  return (
    <div className="container max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Brain & Focus Exercises</h1>
      </div>

      <div className="grid gap-8">
        <NumberSequence />
        <MemoryCards />
        <PatternMatch />
        <WordScramble />
        <ColorMatch />
        <MathSpeed />
        <SimonSays />
        <SpeedTyping />
        <VisualMemory />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">About These Exercises</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• <strong>Number Sequence:</strong> Test your quick thinking and focus by clicking numbers in order</li>
          <li>• <strong>Memory Cards:</strong> Challenge your memory by matching pairs of cards</li>
          <li>• <strong>Pattern Match:</strong> Improve pattern recognition by memorizing and recreating sequences</li>
          <li>• <strong>Word Scramble:</strong> Enhance vocabulary and mental agility by unscrambling words</li>
          <li>• <strong>Color Match:</strong> Test your reaction time and cognitive flexibility with color-word matching</li>
          <li>• <strong>Math Speed:</strong> Sharpen your mental math skills with quick calculations</li>
          <li>• <strong>Simon Says:</strong> Test your memory and sequence recall with color patterns</li>
          <li>• <strong>Speed Typing:</strong> Improve typing speed and accuracy while maintaining focus</li>
          <li>• <strong>Visual Memory:</strong> Enhance spatial memory by remembering grid patterns</li>
          <li>• All results are saved to track your progress over time</li>
          <li>• Regular practice can help improve concentration and cognitive function</li>
        </ul>
      </Card>
    </div>
  );
};

export default Focus;
