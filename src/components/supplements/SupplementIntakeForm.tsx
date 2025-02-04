import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export function SupplementIntakeForm({ onSubmit }: { onSubmit: (values: any) => void }) {
  const [supplementName, setSupplementName] = useState("");
  const [dosage, setDosage] = useState("");
  const [brand, setBrand] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [effectivenessRating, setEffectivenessRating] = useState(5);
  const [energyImpact, setEnergyImpact] = useState(5);
  const [stressImpact, setStressImpact] = useState(5);
  const [focusImpact, setFocusImpact] = useState(5);
  const [moodImpact, setMoodImpact] = useState(5);
  const [sleepImpact, setSleepImpact] = useState(5);
  const [sideEffects, setSideEffects] = useState("");
  const [timingNotes, setTimingNotes] = useState("");
  const [interactionNotes, setInteractionNotes] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplementName || !dosage) {
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
      brand,
      batch_number: batchNumber,
      expiration_date: expirationDate,
      effectiveness_rating: effectivenessRating,
      energy_impact: energyImpact,
      stress_impact: stressImpact,
      focus_impact: focusImpact,
      mood_impact: moodImpact,
      sleep_impact: sleepImpact,
      side_effects: sideEffects,
      timing_notes: timingNotes,
      interaction_notes: interactionNotes,
      notes,
      time_taken: new Date().toISOString(),
    });

    // Reset form
    setSupplementName("");
    setDosage("");
    setBrand("");
    setBatchNumber("");
    setExpirationDate("");
    setEffectivenessRating(5);
    setEnergyImpact(5);
    setStressImpact(5);
    setFocusImpact(5);
    setMoodImpact(5);
    setSleepImpact(5);
    setSideEffects("");
    setTimingNotes("");
    setInteractionNotes("");
    setNotes("");
  };

  const ImpactSlider = ({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">{value}/10</span>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={10}
        step={1}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="supplementName">Supplement Name *</Label>
          <Input
            id="supplementName"
            value={supplementName}
            onChange={(e) => setSupplementName(e.target.value)}
            placeholder="Enter supplement name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g., 500mg"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter brand name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchNumber">Batch Number</Label>
          <Input
            id="batchNumber"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="Enter batch number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration Date</Label>
          <Input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-4 space-y-4">
        <h3 className="font-medium">Impact Ratings</h3>
        <ImpactSlider
          label="Overall Effectiveness"
          value={effectivenessRating}
          onChange={setEffectivenessRating}
        />
        <ImpactSlider
          label="Energy Impact"
          value={energyImpact}
          onChange={setEnergyImpact}
        />
        <ImpactSlider
          label="Stress Impact"
          value={stressImpact}
          onChange={setStressImpact}
        />
        <ImpactSlider
          label="Focus Impact"
          value={focusImpact}
          onChange={setFocusImpact}
        />
        <ImpactSlider
          label="Mood Impact"
          value={moodImpact}
          onChange={setMoodImpact}
        />
        <ImpactSlider
          label="Sleep Impact"
          value={sleepImpact}
          onChange={setSleepImpact}
        />
      </Card>

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
        <Label htmlFor="timingNotes">Timing Notes</Label>
        <Textarea
          id="timingNotes"
          value={timingNotes}
          onChange={(e) => setTimingNotes(e.target.value)}
          placeholder="When did you take it? With food?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interactionNotes">Interaction Notes</Label>
        <Textarea
          id="interactionNotes"
          value={interactionNotes}
          onChange={(e) => setInteractionNotes(e.target.value)}
          placeholder="Any interactions with other supplements or medications?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional observations or notes"
        />
      </div>

      <Button type="submit" className="w-full">Log Supplement</Button>
    </form>
  );
}