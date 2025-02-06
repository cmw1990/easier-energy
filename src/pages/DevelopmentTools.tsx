
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseAssetsGenerator } from "@/components/exercises/ExerciseAssetsGenerator";
import { GameAssetsGenerator } from "@/components/GameAssetsGenerator";
import { ZenDriftAssetsGenerator } from "@/components/games/ZenDriftAssetsGenerator";
import { GenerateBackgroundsButton } from "@/components/meditation/GenerateBackgroundsButton";

const DevelopmentTools = () => {
  // Only show in development mode
  if (!import.meta.env.DEV) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Development Tools</h1>
        <p>This page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Development Tools</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Eye Exercise Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseAssetsGenerator />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <GameAssetsGenerator />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zen Drift Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <ZenDriftAssetsGenerator />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meditation Backgrounds</CardTitle>
          </CardHeader>
          <CardContent>
            <GenerateBackgroundsButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevelopmentTools;
