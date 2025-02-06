
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Timer, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BreakSuggestion {
  title: string;
  duration: number;
  icon: JSX.Element;
  description: string;
}

export const SmartBreakSuggestions = () => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<BreakSuggestion[]>([]);
  const [activeBreak, setActiveBreak] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    generateSuggestions();
  }, []);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev !== null ? prev - 1 : null);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      endBreak();
    }
  }, [timer]);

  const generateSuggestions = () => {
    const breakSuggestions: BreakSuggestion[] = [
      {
        title: "Quick Refresh",
        duration: 5,
        icon: <Coffee className="h-5 w-5 text-blue-500" />,
        description: "Stand up, stretch, and grab a glass of water"
      },
      {
        title: "Mind Reset",
        duration: 10,
        icon: <Brain className="h-5 w-5 text-purple-500" />,
        description: "Practice deep breathing or quick meditation"
      },
      {
        title: "Energy Boost",
        duration: 15,
        icon: <Timer className="h-5 w-5 text-green-500" />,
        description: "Take a short walk or do some quick exercises"
      }
    ];
    setSuggestions(breakSuggestions);
  };

  const startBreak = (title: string, duration: number) => {
    setActiveBreak(title);
    setTimer(duration * 60);
    toast({
      title: "Break Started",
      description: `Taking a ${duration} minute ${title} break`
    });
  };

  const endBreak = () => {
    setActiveBreak(null);
    setTimer(null);
    toast({
      title: "Break Complete",
      description: "Time to get back to focus mode!"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Smart Break Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeBreak ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">{activeBreak}</h3>
            {timer !== null && (
              <div className="text-3xl font-mono">{formatTime(timer)}</div>
            )}
            <Button onClick={endBreak} variant="outline">End Break Early</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.title} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {suggestion.icon}
                    <div>
                      <h3 className="font-medium">{suggestion.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => startBreak(suggestion.title, suggestion.duration)}
                    size="sm"
                  >
                    {suggestion.duration}m
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
