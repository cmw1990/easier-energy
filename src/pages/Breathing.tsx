import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreathingVisualizer } from "@/components/breathing/BreathingVisualizer";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";
import { Suspense, lazy } from 'react';
import { Wind, Gamepad2 } from "lucide-react";
import { Loader2 } from "lucide-react";

// Lazy load game components
const BreathingGame = lazy(() => import("@/components/games/BreathingGame"));
const BalloonJourney = lazy(() => import("@/components/games/BalloonJourney"));
const PufferfishScene3D = lazy(() => import("@/components/games/scenes/PufferfishScene3D"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const Breathing = () => {
  const [selectedGame, setSelectedGame] = useState<string>("pufferfish");
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');

  useEffect(() => {
    // Preload game components when tab is selected
    if (selectedGame === "pufferfish") {
      import("@/components/games/scenes/PufferfishScene3D");
    } else if (selectedGame === "balloon") {
      import("@/components/games/BalloonJourney");
    } else if (selectedGame === "breathing") {
      import("@/components/games/BreathingGame");
    }
  }, [selectedGame]);

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
              <TabsTrigger value="pufferfish">
                Pufferfish
              </TabsTrigger>
              <TabsTrigger value="balloon">Balloon Journey</TabsTrigger>
              <TabsTrigger value="breathing">Breathing Game</TabsTrigger>
            </TabsList>

            <Suspense fallback={<LoadingFallback />}>
              <TabsContent value="pufferfish">
                <PufferfishScene3D breathPhase={breathPhase} />
              </TabsContent>

              <TabsContent value="balloon">
                <BalloonJourney />
              </TabsContent>

              <TabsContent value="breathing">
                <BreathingGame />
              </TabsContent>
            </Suspense>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Breathing;