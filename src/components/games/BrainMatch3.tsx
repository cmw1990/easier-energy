import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, RefreshCw } from "lucide-react";

type TileType = {
  id: number;
  value: string;
  matched: boolean;
  selected: boolean;
};

const GRID_SIZE = 8;
const TILE_TYPES = ['1', '2', '3', '4', '5', '+', '-', '×'];

const BrainMatch3 = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [grid, setGrid] = useState<TileType[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: TileType[] = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      newGrid.push({
        id: i,
        value: TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)],
        matched: false,
        selected: false
      });
    }
    setGrid(newGrid);
    setSelectedTiles([]);
    setScore(0);
  };

  const handleTileClick = (index: number) => {
    if (grid[index].matched || selectedTiles.includes(index)) return;

    const newGrid = [...grid];
    const newSelectedTiles = [...selectedTiles, index];
    newGrid[index].selected = true;
    setGrid(newGrid);
    setSelectedTiles(newSelectedTiles);

    if (newSelectedTiles.length === 3) {
      checkMatch(newSelectedTiles);
    }
  };

  const checkMatch = (tiles: number[]) => {
    const values = tiles.map(i => grid[i].value);
    
    // Check if we have a valid mathematical expression
    const isValidMatch = checkMathematicalMatch(values);

    const newGrid = [...grid];
    
    if (isValidMatch) {
      // Mark matched tiles
      tiles.forEach(i => {
        newGrid[i].matched = true;
        newGrid[i].selected = false;
      });
      
      // Update score
      setScore(prev => prev + 10);
      
      // Drop new tiles
      setTimeout(() => {
        dropNewTiles(tiles);
      }, 300);
      
      toast({
        title: "Match found!",
        description: "Great mathematical thinking!",
      });
    } else {
      // Reset selection
      tiles.forEach(i => {
        newGrid[i].selected = false;
      });
    }
    
    setGrid(newGrid);
    setSelectedTiles([]);
  };

  const checkMathematicalMatch = (values: string[]) => {
    // Sort to ensure operator is in the middle
    const sorted = [...values].sort();
    
    // Check if we have 2 numbers and 1 operator
    const hasOperator = sorted.some(v => ['+', '-', '×'].includes(v));
    const numbers = sorted.filter(v => !isNaN(Number(v)));
    
    if (!hasOperator || numbers.length !== 2) return false;
    
    // Get operator and numbers
    const operator = values.find(v => ['+', '-', '×'].includes(v));
    const nums = values.filter(v => !isNaN(Number(v))).map(Number);
    
    // Calculate result
    let result = 0;
    switch(operator) {
      case '+':
        result = nums[0] + nums[1];
        break;
      case '-':
        result = nums[0] - nums[1];
        break;
      case '×':
        result = nums[0] * nums[1];
        break;
    }
    
    // Match is valid if result is divisible by 3
    return result % 3 === 0;
  };

  const dropNewTiles = (matchedIndices: number[]) => {
    const newGrid = [...grid];
    
    // Drop existing tiles
    for (let col = 0; col < GRID_SIZE; col++) {
      let emptySpaces = 0;
      
      // Count empty spaces and move tiles down
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        const index = row * GRID_SIZE + col;
        
        if (matchedIndices.includes(index)) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          const newIndex = (row + emptySpaces) * GRID_SIZE + col;
          newGrid[newIndex] = { ...newGrid[index] };
          newGrid[index] = {
            id: index,
            value: TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)],
            matched: false,
            selected: false
          };
        }
      }
      
      // Fill top rows with new tiles
      for (let i = 0; i < emptySpaces; i++) {
        const index = i * GRID_SIZE + col;
        newGrid[index] = {
          id: index,
          value: TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)],
          matched: false,
          selected: false
        };
      }
    }
    
    setGrid(newGrid);
  };

  const saveScore = async () => {
    if (!session?.user?.id || score === 0) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("energy_focus_logs").insert({
        user_id: session.user.id,
        activity_type: "brain_game",
        activity_name: "Brain Match 3",
        duration_minutes: Math.ceil(score / 30),
        focus_rating: Math.min(100, score),
        energy_rating: null,
        notes: `Completed Brain Match 3 with score ${score}`
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Brain Match 3</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Score: {score}</div>
          <Button 
            onClick={initializeGrid}
            variant="outline"
            size="icon"
            disabled={isSubmitting}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 mb-6">
        {grid.map((tile, index) => (
          <Button
            key={tile.id}
            onClick={() => handleTileClick(index)}
            variant={tile.selected ? "default" : "outline"}
            className={`h-12 text-lg transition-all ${
              tile.matched ? 'opacity-0' : ''
            }`}
            disabled={tile.matched || isSubmitting}
          >
            {tile.value}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Match 3 tiles to form equations with results divisible by 3
        </div>
        <Button onClick={saveScore} disabled={score === 0 || isSubmitting}>
          Save Score
        </Button>
      </div>
    </Card>
  );
};

export default BrainMatch3;