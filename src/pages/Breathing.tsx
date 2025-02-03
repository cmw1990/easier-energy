import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Breathing = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timer, setTimer] = useState(4);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            switch (phase) {
              case "inhale":
                setPhase("hold");
                return 7;
              case "hold":
                setPhase("exhale");
                return 8;
              case "exhale":
                setPhase("inhale");
                return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const startExercise = () => {
    setIsActive(true);
    toast({
      title: "Breathing Exercise Started",
      description: "Follow the circle's rhythm for optimal results.",
    });
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimer(4);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold">Breathing Exercise</h1>
      
      <Card className="p-8 flex flex-col items-center space-y-6">
        <div className={`w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center
          ${isActive ? "animate-breathe" : ""}`}>
          <div className="text-2xl font-semibold">
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
            <div className="text-4xl">{timer}s</div>
          </div>
        </div>

        <div className="space-x-4">
          {!isActive ? (
            <Button onClick={startExercise}>Start Exercise</Button>
          ) : (
            <Button variant="destructive" onClick={stopExercise}>Stop</Button>
          )}
        </div>

        <div className="text-sm text-gray-500 text-center">
          <p>4-7-8 Breathing Technique</p>
          <p>Inhale for 4 seconds</p>
          <p>Hold for 7 seconds</p>
          <p>Exhale for 8 seconds</p>
        </div>
      </Card>
    </div>
  );
};

export default Breathing;