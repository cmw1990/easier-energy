import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Puzzle, Book } from "lucide-react";
import MemoryCards from "@/components/games/MemoryCards";

export const FocusExercises = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Memory & Focus Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <MemoryCards />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};