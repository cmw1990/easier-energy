import { useState, useEffect } from "react";
import { TileType } from "./types";
import { useToast } from "@/hooks/use-toast";

const GRID_SIZE = 8;
const TILE_TYPES = ['1', '2', '3', '4', '5', '+', '-', '×'];

export const useGameLogic = () => {
  const { toast } = useToast();
  const [grid, setGrid] = useState<TileType[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [score, setScore] = useState(0);

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

  const checkMathematicalMatch = (values: string[]) => {
    const sorted = [...values].sort();
    const hasOperator = sorted.some(v => ['+', '-', '×'].includes(v));
    const numbers = sorted.filter(v => !isNaN(Number(v)));
    
    if (!hasOperator || numbers.length !== 2) return false;
    
    const operator = values.find(v => ['+', '-', '×'].includes(v));
    const nums = values.filter(v => !isNaN(Number(v))).map(Number);
    
    let result = 0;
    switch(operator) {
      case '+': result = nums[0] + nums[1]; break;
      case '-': result = nums[0] - nums[1]; break;
      case '×': result = nums[0] * nums[1]; break;
    }
    
    return result % 3 === 0;
  };

  const dropNewTiles = (matchedIndices: number[]) => {
    const newGrid = [...grid];
    
    for (let col = 0; col < GRID_SIZE; col++) {
      let emptySpaces = 0;
      
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

  const handleTileClick = (index: number) => {
    if (grid[index].matched || selectedTiles.includes(index)) return;

    const newGrid = [...grid];
    const newSelectedTiles = [...selectedTiles, index];
    newGrid[index].selected = true;
    setGrid(newGrid);
    setSelectedTiles(newSelectedTiles);

    if (newSelectedTiles.length === 3) {
      const values = newSelectedTiles.map(i => grid[i].value);
      const isValidMatch = checkMathematicalMatch(values);
      
      if (isValidMatch) {
        newSelectedTiles.forEach(i => {
          newGrid[i].matched = true;
          newGrid[i].selected = false;
        });
        
        setScore(prev => prev + 10);
        setTimeout(() => dropNewTiles(newSelectedTiles), 300);
        
        toast({
          title: "Match found!",
          description: "Great mathematical thinking!",
        });
      } else {
        newSelectedTiles.forEach(i => {
          newGrid[i].selected = false;
        });
      }
      
      setGrid(newGrid);
      setSelectedTiles([]);
    }
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  return {
    grid,
    score,
    selectedTiles,
    initializeGrid,
    handleTileClick
  };
};