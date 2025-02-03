import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Target, Puzzle, GamepadIcon, Zap, Clock, BookOpen } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import MemoryCards from "@/components/games/MemoryCards";
import PatternMatch from "@/components/games/PatternMatch";
import WordScramble from "@/components/games/WordScramble";
import ColorMatch from "@/components/games/ColorMatch";
import MathSpeed from "@/components/games/MathSpeed";
import SimonSays from "@/components/games/SimonSays";
import SpeedTyping from "@/components/games/SpeedTyping";
import VisualMemory from "@/components/games/VisualMemory";
import PatternRecognition from "@/components/games/PatternRecognition";
import SequenceMemory from "@/components/games/SequenceMemory";
import WordAssociation from "@/components/games/WordAssociation";

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
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Puzzle className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Number Sequence
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-medium">
            Score: <span className="text-primary">{score}</span>
          </div>
          <div className="text-lg font-medium">
            Time: <span className={`${timeLeft <= 10 ? 'text-energy-low animate-pulse' : 'text-secondary'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {targets.map((number, index) => (
          <Button
            key={`${number}-${index}`}
            onClick={() => handleNumberClick(number)}
            variant={number === currentTarget ? "default" : "outline"}
            className={`h-16 text-xl font-bold transition-all ${
              number === currentTarget ? 'ring-2 ring-primary ring-offset-2 animate-breathe' : ''
            } hover:scale-105`}
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
            className="w-full group relative overflow-hidden" 
            size="lg"
            disabled={isSubmitting}
          >
            <span className="relative z-10">Start Test</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-75 group-hover:animate-shimmer" />
          </Button>
        ) : (
          <Button 
            variant="destructive" 
            onClick={endTest} 
            className="w-full hover:scale-105 transition-transform"
            size="lg"
            disabled={isSubmitting}
          >
            End Test
          </Button>
        )}

        <div className="mt-4">
          <div className="text-sm text-muted-foreground">
            Click numbers in ascending order (1-9). Complete as many sequences as possible in 30 seconds.
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span>Improves: Quick Thinking, Pattern Recognition, Focus</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Focus = () => {
  const { session } = useAuth();
  const { toast } = useToast();

  const saveFocusScore = async (score: number, exercise: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase.from('energy_focus_logs').insert({
        user_id: session.user.id,
        activity_type: 'focus_exercise',
        activity_name: exercise,
        focus_rating: score,
        duration_minutes: 5,
        notes: `Completed ${exercise} exercise`
      });

      if (error) throw error;

      toast({
        title: "Score saved!",
        description: `Your score of ${score} has been recorded.`
      });
    } catch (error) {
      console.error('Error saving focus score:', error);
      toast({
        title: "Error saving score",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full animate-float">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Brain & Focus Training
        </h1>
      </div>

      <Tabs defaultValue="quick" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Exercises
          </TabsTrigger>
          <TabsTrigger value="memory" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Memory
          </TabsTrigger>
          <TabsTrigger value="cognitive" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Cognitive
          </TabsTrigger>
          <TabsTrigger value="timed" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timed Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <NumberSequence />
          <ColorMatch />
          <MathSpeed />
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <MemoryCards />
          <SequenceMemory />
          <VisualMemory />
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-4">
          <WordScramble />
          <PatternMatch />
          <WordAssociation />
        </TabsContent>

        <TabsContent value="timed" className="space-y-4">
          <SimonSays />
          <SpeedTyping />
          <PatternRecognition />
        </TabsContent>
      </Tabs>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          About These Exercises
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Quick Exercises</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Number Sequence: Test quick thinking and focus</li>
              <li>• Color Match: Improve reaction time and cognitive flexibility</li>
              <li>• Math Speed: Enhance mental calculation abilities</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Memory Training</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Memory Cards: Challenge visual memory</li>
              <li>• Sequence Memory: Improve working memory</li>
              <li>• Visual Memory: Enhance spatial recall</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Cognitive Development</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Word Scramble: Build vocabulary and mental agility</li>
              <li>• Pattern Match: Strengthen pattern recognition</li>
              <li>• Word Association: Develop cognitive connections</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Timed Challenges</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Simon Says: Test memory and sequence recall</li>
              <li>• Speed Typing: Improve typing speed and accuracy</li>
              <li>• Pattern Recognition: Train visual processing</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Focus;
