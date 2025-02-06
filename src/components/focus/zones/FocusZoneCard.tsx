
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Save } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface FocusZoneProps {
  onSave?: () => void;
}

export const FocusZoneCard = ({ onSave }: FocusZoneProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [locationType, setLocationType] = useState("");
  const [amenities, setAmenities] = useState("");

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save focus zones",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("focus_zones").insert({
        user_id: session.user.id,
        name,
        location_type: locationType,
        amenities: amenities.split(",").map(a => a.trim()),
      });

      if (error) throw error;

      toast({
        title: "Focus zone saved",
        description: "Your focus zone has been saved successfully",
      });

      setName("");
      setLocationType("");
      setAmenities("");
      
      if (onSave) onSave();
    } catch (error) {
      console.error("Error saving focus zone:", error);
      toast({
        title: "Error",
        description: "Failed to save focus zone. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Create Focus Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Zone Name</Label>
          <Input
            placeholder="e.g., Home Office"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Location Type</Label>
          <Input
            placeholder="e.g., Indoor, Quiet Space"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Amenities (comma-separated)</Label>
          <Input
            placeholder="e.g., Desk, Good Lighting, Plants"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Zone
        </Button>
      </CardContent>
    </Card>
  );
};
