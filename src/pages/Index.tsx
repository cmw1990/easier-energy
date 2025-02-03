import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Boost Your Focus & Energy
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Block Distractions</h2>
            <p className="text-muted-foreground">
              Take control of your focus by blocking distracting websites, apps, and notifications
              during your productive hours.
            </p>
            <Button
              onClick={() => navigate('/distraction-blocker')}
              className="w-full"
            >
              Start Blocking
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Train Your Focus</h2>
            <p className="text-muted-foreground">
              Improve your concentration with brain training exercises and track your progress
              over time.
            </p>
            <Button
              onClick={() => navigate('/focus')}
              className="w-full"
            >
              Train Focus
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Block Distractions?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2">
            <Activity className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Boost Productivity</h3>
            <p className="text-sm text-muted-foreground">
              Stay focused on what matters most without digital interruptions
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Brain className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Improve Focus</h3>
            <p className="text-sm text-muted-foreground">
              Train your brain to maintain longer periods of deep concentration
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Shield className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Reduce Stress</h3>
            <p className="text-sm text-muted-foreground">
              Lower anxiety by limiting exposure to digital distractions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;