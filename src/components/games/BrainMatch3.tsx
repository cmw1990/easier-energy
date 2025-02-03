import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Puzzle } from "lucide-react";

type TileType = {
  id: number;
  type: string;
  value: number;
  matched: boolean;
};

const GRID_SIZE = 6;
const MATCH_SIZE = 3;

const BrainMatch3 = () => {
  const [tiles, setTiles] = useState<TileType[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const generateTiles = () => {
    const operations = ["+", "-", "×"];
    const newTiles: TileType[] = [];
    
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const operation = operations[Math.floor(Math.random() * operations.length)];
      const value = Math.floor(Math.random() * 9) + 1;
      
      newTiles.push({
        id: i,
        type: operation,
        value: value,
        matched: false,
      });
    }
    
    setTiles(newTiles);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(60);
    generateTiles();
    toast({
      title: "Game Started!",
      description: "Match 3 or more tiles that form valid math equations!",
    });
  };

  const calculateResult = (tiles: TileType[]) => {
    let result = tiles[0].value;
    for (let i = 1; i < tiles.length - 1; i += 2) {
      const operation = tiles[i].type;
      const nextValue = tiles[i + 1].value;
      
      switch (operation) {
        case "+":
          result += nextValue;
          break;
        case "-":
          result -= nextValue;
          break;
        case "×":
          result *= nextValue;
          break;
      }
    }
    return result;
  };

  const checkMatch = (selectedIndices: number[]) => {
    if (selectedIndices.length >= MATCH_SIZE) {
      const selectedTiles = selectedIndices.map(index => tiles[index]);
      const result = calculateResult(selectedTiles);
      
      if (result % MATCH_SIZE === 0) {
        const newTiles = [...tiles];
        selectedIndices.forEach(index => {
          newTiles[index].matched = true;
        });
        setTiles(newTiles);
        setScore(prev => prev + selectedIndices.length);
        setSelectedTiles([]);
        
        // Replace matched tiles
        setTimeout(() => {
          const operations = ["+", "-", "×"];
          const newerTiles = [...newTiles];
          selectedIndices.forEach(index => {
            newerTiles[index] = {
              id: Math.random(),
              type: operations[Math.floor(Math.random() * operations.length)],
              value: Math.floor(Math.random() * 9) + 1,
              matched: false,
            };
          });
          setTiles(newerTiles);
        }, 300);
      } else {
        setSelectedTiles([]);
      }
    }
  };

  const handleTileClick = (index: number) => {
    if (!isActive || tiles[index].matched) return;
    
    const newSelected = [...selectedTiles, index];
    setSelectedTiles(newSelected);
    checkMatch(newSelected);
  };

  const endGame = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "brain_match3",
          activity_name: "Brain Match 3",
          duration_minutes: 1,
          focus_rating: Math.round((score / 60) * 10),
          energy_rating: null,
          notes: `Completed Brain Match 3 with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Great job!`,
        });
      } catch (error) {
        console.error("Error logging game:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your game results.",
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
          <div className="p-2 bg-primary/10 rounded-full animate-bounce">
            <Puzzle className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Brain Match 3</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">Score: {score}</div>
          <div className="text-lg">Time: {timeLeft}s</div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-6">
        {tiles.map((tile, index) => (
          <Button
            key={tile.id}
            onClick={() => handleTileClick(index)}
            variant={selectedTiles.includes(index) ? "default" : "outline"}
            className={`h-16 text-xl font-bold transition-all ${
              tile.matched ? 'opacity-50' : ''
            } ${selectedTiles.includes(index) ? 'ring-2 ring-primary ring-offset-2' : ''} 
            hover:scale-105 ${tile.matched ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={tile.matched || isSubmitting}
          >
            {tile.type === "×" ? tile.type : ""}{tile.value}
          </Button>
        ))}
      </div>

      {!isActive ? (
        <Button 
          onClick={startGame} 
          className="w-full animate-pulse"
          disabled={isSubmitting}
        >
          Start Game
        </Button>
      ) : (
        <Button 
          variant="destructive" 
          onClick={endGame} 
          className="w-full"
          disabled={isSubmitting}
        >
          End Game
        </Button>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Match 3 or more adjacent numbers and operations to create valid equations. The result should be divisible by 3!</p>
        <div className="mt-2 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          <span>Improves: Mental Math, Pattern Recognition, Quick Thinking</span>
        </div>
      </div>
    </Card>
  );
};

export default BrainMatch3;