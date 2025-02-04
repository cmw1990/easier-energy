import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Eye, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const VisionBoard = () => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState("");

  const { data: visionItems } = useQuery({
    queryKey: ["visionBoard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("goal_type", "vision")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addVisionItem = async () => {
    const { error } = await supabase
      .from("goals")
      .insert([{
        title: "Vision Board Item",
        goal_type: "vision",
        description: imageUrl
      }]);

    if (error) {
      toast({
        title: "Error adding item",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Item added!",
        description: "Keep building your vision!",
      });
      setImageUrl("");
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Eye className="h-6 w-6 text-purple-500" />
        <h2 className="text-2xl font-semibold">Vision Board</h2>
      </div>

      <div className="flex gap-2">
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1"
        />
        <Button onClick={addVisionItem}>
          <ImagePlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visionItems?.map((item) => (
          <div
            key={item.id}
            className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={item.description}
              alt="Vision board item"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};