import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function SupplementIntakeForm({ onSubmit }: { onSubmit: (values: any) => void }) {
  const [supplementName, setSupplementName] = useState("");
  const [dosage, setDosage] = useState("");
  const [effectivenessRating, setEffectivenessRating] = useState("");
  const [sideEffects, setSideEffects] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplementName || !dosage || !effectivenessRating) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      supplement_name: supplementName,
      dosage,
      effectiveness_rating: parseInt(effectivenessRating),
      side_effects: sideEffects,
      notes,
      time_taken: new Date().toISOString(),
    });

    setSupplementName("");
    setDosage("");
    setEffectivenessRating("");
    setSideEffects("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="supplementName">Supplement Name</Label>
        <Input
          id="supplementName"
          value={supplementName}
          onChange={(e) => setSupplementName(e.target.value)}
          placeholder="Enter supplement name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dosage">Dosage</Label>
        <Input
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="e.g., 500mg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="effectivenessRating">Effectiveness (1-10)</Label>
        <Input
          id="effectivenessRating"
          type="number"
          min="1"
          max="10"
          value={effectivenessRating}
          onChange={(e) => setEffectivenessRating(e.target.value)}
          placeholder="Rate effectiveness"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sideEffects">Side Effects</Label>
        <Input
          id="sideEffects"
          value={sideEffects}
          onChange={(e) => setSideEffects(e.target.value)}
          placeholder="Any side effects?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes"
        />
      </div>

      <Button type="submit" className="w-full">Log Supplement</Button>
    </form>
  );
}