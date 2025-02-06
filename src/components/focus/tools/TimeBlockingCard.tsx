
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const TimeBlockingCard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Array<{ time: string; activity: string }>>([]);
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState("");

  const addBlock = () => {
    if (!time || !activity) return;
    setBlocks([...blocks, { time, activity }]);
    setTime("");
    setActivity("");
  };

  const saveSchedule = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save schedules",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("executive_function_tools").insert({
        user_id: session.user.id,
        tool_type: "time_blocking",
        schedule: { blocks },
      });

      if (error) throw error;

      toast({
        title: "Schedule saved",
        description: "Your time blocks have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Error",
        description: "Failed to save schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Time Blocking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="flex-[2] space-y-2">
            <Label>Activity</Label>
            <div className="flex gap-2">
              <Input
                placeholder="What will you work on?"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
              <Button onClick={addBlock} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {blocks.length > 0 && (
          <div className="space-y-2">
            <Label>Schedule</Label>
            <div className="space-y-2">
              {blocks.map((block, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-background rounded-md">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">{block.time}</span>
                  <span className="flex-1">{block.activity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={saveSchedule} className="w-full">
          Save Schedule
        </Button>
      </CardContent>
    </Card>
  );
};
