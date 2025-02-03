import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flower2, Wind, Car } from "lucide-react";
import { ZenDrift } from "@/components/games/ZenDrift";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";
import { OpenAITest } from "@/components/OpenAITest";
import { GameAssetsGenerator } from "@/components/GameAssetsGenerator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Relax = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Flower2 className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Relaxation Space</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a moment to unwind and find your inner peace through various relaxation techniques and mindful activities.
        </p>
        <div className="flex justify-center gap-4">
          <OpenAITest />
          <GameAssetsGenerator />
        </div>
      </div>

      <Tabs defaultValue="zendrift" className="space-y-4">
        <TabsList className="grid grid-cols-2 gap-4">
          <TabsTrigger value="zendrift" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Zen Drift
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Breathing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zendrift">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Zen Drift Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ZenDrift />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breathing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Breathing Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BreathingTechniques />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5 border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium text-primary">Zen Drift</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Practice mindful control through scenic drives</li>
                <li>• Experience the flow state in beautiful environments</li>
                <li>• Let go of stress through smooth drifting mechanics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-primary">Breathing Exercises</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Follow guided breathing patterns</li>
                <li>• Reduce stress and anxiety</li>
                <li>• Improve focus and mental clarity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relax;