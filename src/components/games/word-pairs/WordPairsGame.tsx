import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

type WordPair = {
  word1: string;
  word2: string;
};

const INITIAL_PAIRS: WordPair[] = [
  { word1: "Sky", word2: "Blue" },
  { word1: "Fire", word2: "Hot" },
  { word1: "Ice", word2: "Cold" },
  { word1: "Tree", word2: "Green" },
  { word1: "Sun", word2: "Bright" },
  { word1: "Night", word2: "Dark" },
  { word1: "Sugar", word2: "Sweet" },
  { word1: "Lemon", word2: "Sour" },
];

export const WordPairsGame = () => {
  const { toast } = useToast();
  const [pairs, setPairs] = useState<WordPair[]>([]);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [gamePhase, setGamePhase] = useState<'study' | 'test'>('study');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (gamePhase === 'study' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      if (timeLeft === 0) {
        setGamePhase('test');
        shuffleWords();
      }

      return () => clearInterval(timer);
    }
  }, [timeLeft, gamePhase]);

  const startNewGame = () => {
    setPairs([...INITIAL_PAIRS]);
    setTimeLeft(30);
    setGamePhase('study');
    setScore(0);
    setSelectedWord(null);
  };

  const shuffleWords = () => {
    const allWords = pairs.flatMap(pair => [pair.word1, pair.word2]);
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setDisplayedWords(shuffled);
  };

  const handleWordClick = async (word: string) => {
    if (gamePhase !== 'test') return;

    if (!selectedWord) {
      setSelectedWord(word);
      return;
    }

    const isMatch = pairs.some(
      pair => 
        (pair.word1 === selectedWord && pair.word2 === word) ||
        (pair.word2 === selectedWord && pair.word1 === word)
    );

    if (isMatch) {
      setScore(prev => prev + 10);
      setDisplayedWords(prev => prev.filter(w => w !== word && w !== selectedWord));
      toast({
        title: "Correct match!",
        description: "Keep going!",
      });
    } else {
      setScore(prev => Math.max(0, prev - 5));
      toast({
        title: "Not a match",
        description: "Try again",
        variant: "destructive",
      });
    }

    setSelectedWord(null);

    if (displayedWords.length <= 2) {
      setIsLoading(true);
      try {
        await supabase
          .from('board_games')
          .insert({
            game_type: 'word_pairs',
            score,
            game_state: { pairs },
            status: 'completed'
          });

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}`,
        });
      } catch (error) {
        console.error('Error saving game:', error);
      } finally {
        setIsLoading(false);
        startNewGame();
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Word Pairs Memory Game</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl">Score: {score}</div>
          {gamePhase === 'study' && (
            <div className="text-xl">Time to memorize: {timeLeft}s</div>
          )}
          <Button onClick={startNewGame} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'New Game'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gamePhase === 'study' ? (
          pairs.map((pair, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="font-semibold">{pair.word1}</div>
              <div className="text-muted-foreground">goes with</div>
              <div className="font-semibold">{pair.word2}</div>
            </Card>
          ))
        ) : (
          displayedWords.map((word, index) => (
            <Button
              key={index}
              onClick={() => handleWordClick(word)}
              className={`h-24 ${selectedWord === word ? 'bg-primary' : ''}`}
              variant={selectedWord === word ? "default" : "outline"}
            >
              {word}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};

export default WordPairsGame;