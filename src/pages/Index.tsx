import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Activity, Ban, Clock, Bell, BellOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BlockingStats } from "@/components/distraction/BlockingStats";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { BlockingConfirmDialog } from "@/components/distraction/BlockingConfirmDialog";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockingAction, setBlockingAction] = useState<"block" | "allow">("block");

  const handleBlockingAction = (action: "block" | "allow") => {
    setBlockingAction(action);
    setDialogOpen(true);
  };

  if (!session) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Take Control of Your Focus
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          Sign in to start managing your distractions and boost productivity.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Take Control of Your Focus
      </h1>

      <BlockingStats />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Ban className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Block Distractions</h2>
            <p className="text-muted-foreground">
              Take control of your focus by blocking distracting websites and apps during your productive hours.
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
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Schedule Focus Time</h2>
            <p className="text-muted-foreground">
              Set up automated blocking schedules to maintain consistent focus periods throughout your day.
            </p>
            <Button
              onClick={() => navigate('/distraction-blocker')}
              variant="outline"
              className="w-full"
            >
              Set Schedule
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => handleBlockingAction("block")}
          >
            <BellOff className="h-6 w-6" />
            <span>Block All</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => handleBlockingAction("allow")}
          >
            <Bell className="h-6 w-6" />
            <span>Allow All</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/focus')}
          >
            <Brain className="h-6 w-6" />
            <span>Focus Mode</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/breathing')}
          >
            <Activity className="h-6 w-6" />
            <span>Take a Break</span>
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Features</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Shield className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Website Blocking</h3>
            <p className="text-sm text-muted-foreground">
              Block distracting websites during focus time
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Activity className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">App Control</h3>
            <p className="text-sm text-muted-foreground">
              Manage mobile app usage and notifications
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Brain className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Focus Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track your progress and identify patterns
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-muted-foreground">
          Ready to boost your productivity? Start by setting up your first distraction block.
        </p>
        <Button
          onClick={() => navigate('/distraction-blocker')}
          variant="link"
          className="mt-2"
        >
          Get Started →
        </Button>
      </div>

      <BlockingConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={blockingAction}
      />
    </div>
  );
};

export default Index;