import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Sparkles } from "lucide-react";

const PATTERNS = [
  ["⭐", "🌙", "⭐", "🌙"],
  ["🌈", "☁️", "🌈", "☁️", "🌈"],
  ["🌞", "🌍", "🌞", "🌍", "🌞"],
  ["🎨", "🎭", "🎨", "🎭", "🎨"],
];

const PatternRecognition = () => {
  const [currentPattern, setCurrentPattern] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [showPattern, setShowPattern] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    startLevel();
  }, [level]);

  const startLevel = () => {
    if (level >= PATTERNS.length) {
      endGame();
      return;
    }
    setCurrentPattern(PATTERNS[level]);
    setUserPattern([]);
    setShowPattern(true);
    setTimeout(() => {
      setShowPattern(false);
    }, 3000);
  };

  const handleSymbolClick = (symbol: string) => {
    if (showPattern || isSubmitting) return;

    const newPattern = [...userPattern, symbol];
    setUserPattern(newPattern);

    if (newPattern.length === currentPattern.length) {
      const correct = newPattern.every((s, i) => s === currentPattern[i]);
      if (correct) {
        setScore(prev => prev + 10);
        toast({
          title: "Pattern Matched!",
          description: "Moving to next level...",
        });
        setTimeout(() => {
          setLevel(prev => prev + 1);
        }, 1000);
      } else {
        toast({
          title: "Incorrect Pattern",
          description: "Try again!",
          variant: "destructive",
        });
        setTimeout(startLevel, 1000);
      }
    }
  };

  const endGame = async () => {
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "pattern_recognition",
          activity_name: "Pattern Recognition",
          duration_minutes: Math.ceil(level),
          focus_rating: Math.round((score / (PATTERNS.length * 10)) * 10),
          energy_rating: null,
          notes: `Completed pattern recognition with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging pattern recognition:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your game results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setLevel(0);
        setScore(0);
      }
    }
  };

  const uniqueSymbols = Array.from(new Set(PATTERNS.flat()));

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Sparkles className="h-5 w-5 text-primary animate-shimmer" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pattern Recognition
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">Level: {level + 1}/{PATTERNS.length}</div>
          <div className="text-lg">Score: <span className="text-primary">{score}</span></div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="grid grid-flow-col gap-4">
          {currentPattern.map((symbol, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 w-16 text-2xl animate-float"
              disabled={true}
            >
              {showPattern ? symbol : "?"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {uniqueSymbols.map((symbol, index) => (
          <Button
            key={index}
            onClick={() => handleSymbolClick(symbol)}
            variant="outline"
            className="h-16 text-2xl hover:scale-105 transition-transform"
            disabled={showPattern || isSubmitting}
          >
            {symbol}
          </Button>
        ))}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Memorize the pattern of symbols shown, then recreate it using the symbols below. The pattern will be hidden after 3 seconds.
      </div>
    </Card>
  );
};

export default PatternRecognition;