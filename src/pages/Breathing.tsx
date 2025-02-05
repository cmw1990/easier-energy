import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreathingVisualizer } from "@/components/breathing/BreathingVisualizer";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";
import BreathingGame from "@/components/games/BreathingGame";
import BalloonJourney from "@/components/games/BalloonJourney";
import PufferfishScene3D from "@/components/games/scenes/PufferfishScene3D";
import { Wind, Gamepad2 } from "lucide-react";

const Breathing = () => {
  const [selectedGame, setSelectedGame] = useState<string>("pufferfish");

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Breathing Exercises
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Breathing Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-8">
          <BreathingVisualizer />
          <BreathingTechniques />
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <Tabs value={selectedGame} onValueChange={setSelectedGame}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pufferfish">Pufferfish</TabsTrigger>
              <TabsTrigger value="balloon">Balloon Journey</TabsTrigger>
              <TabsTrigger value="breathing">Breathing Game</TabsTrigger>
            </TabsList>

            <TabsContent value="pufferfish">
              <PufferfishScene3D breathPhase="inhale" />
            </TabsContent>

            <TabsContent value="balloon">
              <BalloonJourney />
            </TabsContent>

            <TabsContent value="breathing">
              <BreathingGame />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Breathing;