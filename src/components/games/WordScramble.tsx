import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Shuffle } from "lucide-react";

const WORDS = [
  "FOCUS", "BRAIN", "SMART", "THINK", "LEARN",
  "STUDY", "MIND", "SHARP", "QUICK", "ALERT"
];

const WordScramble = () => {
  const [word, setWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    newWord();
  }, []);

  const scrambleWord = (word: string) => {
    return word.split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const newWord = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setScrambledWord(scrambleWord(randomWord));
    setUserGuess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userGuess.toUpperCase() === word) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct!",
        description: "Moving to next word...",
      });
      newWord();
    } else {
      toast({
        title: "Try Again",
        description: "That's not the correct word",
        variant: "destructive",
      });
    }

    if (session?.user) {
      setIsSubmitting(true);
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "word_scramble",
          activity_name: "Word Scramble",
          duration_minutes: 1,
          focus_rating: Math.round((score / 100) * 10),
          energy_rating: null,
          notes: `Completed word scramble with score: ${score}`
        });

        if (error) throw error;
      } catch (error) {
        console.error("Error logging word scramble:", error);
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
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Word Scramble</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">Score: {score}</div>
          <Button 
            onClick={newWord}
            variant="outline"
            size="icon"
            disabled={isSubmitting}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl font-bold tracking-wider mb-4">{scrambledWord}</div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Enter your guess"
            className="text-center text-xl"
            maxLength={word.length}
          />
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Unscramble the letters to find the hidden word. Type your answer and submit to check if you're correct.
      </div>
    </Card>
  );
};

export default WordScramble;