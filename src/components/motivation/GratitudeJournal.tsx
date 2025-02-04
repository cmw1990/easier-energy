import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const GratitudeJournal = () => {
  const { toast } = useToast();
  const [entry, setEntry] = useState("");
  const [category, setCategory] = useState<"people" | "experiences" | "things" | "personal_growth" | "nature" | "other">("experiences");

  const saveJournalEntry = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save journal entries",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("gratitude_journal")
      .insert([{ 
        content: entry, 
        category,
        user_id: user.id
      }]);

    if (error) {
      console.error("Error saving gratitude entry:", error);
      toast({
        title: "Error saving entry",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Entry saved!",
        description: "Keep practicing gratitude!",
      });
      setEntry("");
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-rose-500" />
        <h2 className="text-2xl font-semibold">Gratitude Journal</h2>
      </div>

      <Select value={category} onValueChange={(value: typeof category) => setCategory(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="people">People</SelectItem>
          <SelectItem value="experiences">Experiences</SelectItem>
          <SelectItem value="things">Things</SelectItem>
          <SelectItem value="personal_growth">Personal Growth</SelectItem>
          <SelectItem value="nature">Nature</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="What are you grateful for today?"
        className="min-h-[150px]"
      />

      <Button onClick={saveJournalEntry} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Save Entry
      </Button>
    </Card>
  );
};