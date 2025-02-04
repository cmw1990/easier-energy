import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function NicotineIntakeForm({ onSubmit }: { onSubmit: (values: { amount: string; energyRating: string; consumedAt: string; type: string }) => void }) {
  const [amount, setAmount] = useState("");
  const [energyRating, setEnergyRating] = useState("");
  const [type, setType] = useState("cigarette");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !energyRating) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    onSubmit({
      amount,
      energyRating,
      consumedAt: new Date().toISOString(),
      type,
    });
    setAmount("");
    setEnergyRating("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cigarette">Cigarette</SelectItem>
            <SelectItem value="vape">Vape</SelectItem>
            <SelectItem value="pouch">Nicotine Pouch</SelectItem>
            <SelectItem value="gum">Nicotine Gum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (mg)</Label>
        <Input
          id="amount"
          type="number"
          step="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in mg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="energyRating">Energy Impact (1-10)</Label>
        <Input
          id="energyRating"
          type="number"
          min="1"
          max="10"
          value={energyRating}
          onChange={(e) => setEnergyRating(e.target.value)}
          placeholder="Rate energy impact"
        />
      </div>

      <Button type="submit" className="w-full">Log Intake</Button>
    </form>
  );
}