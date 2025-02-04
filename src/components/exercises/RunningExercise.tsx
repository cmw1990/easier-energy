import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Activity } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const RunningExercise = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const { toast } = useToast();
  
  const startTracking = () => {
    setIsTracking(true);
    toast({
      title: "Running Exercise Started",
      description: "We'll track your running duration",
    });
    
    // Start the timer
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    // Store the interval ID for cleanup
    return () => clearInterval(interval);
  };
  
  const stopTracking = () => {
    setIsTracking(false);
    toast({
      title: "Running Exercise Completed",
      description: `You ran for ${Math.floor(duration / 60)} minutes`,
    });
    setDuration(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Running Exercise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <Button
              onClick={isTracking ? stopTracking : startTracking}
              variant={isTracking ? "destructive" : "default"}
            >
              {isTracking ? "Stop" : "Start"} Running
            </Button>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Start with short intervals and gradually increase duration</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};