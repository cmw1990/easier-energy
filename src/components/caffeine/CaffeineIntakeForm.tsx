import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { useState } from "react";

const CAFFEINE_REFERENCE = [
  { name: "Coffee (8 oz)", amount: 95 },
  { name: "Espresso (1 oz)", amount: 64 },
  { name: "Black Tea (8 oz)", amount: 47 },
  { name: "Green Tea (8 oz)", amount: 28 },
  { name: "Energy Drink (8 oz)", amount: 80 },
  { name: "Cola (12 oz)", amount: 34 },
];

interface CaffeineIntakeFormProps {
  onSubmit: (values: { amount: string; energyRating: string; consumedAt: string }) => void;
}

export const CaffeineIntakeForm = ({ onSubmit }: CaffeineIntakeFormProps) => {
  const [amount, setAmount] = useState("");
  const [energyRating, setEnergyRating] = useState("");
  const [consumedAt, setConsumedAt] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ amount, energyRating, consumedAt });
    setAmount("");
    setEnergyRating("");
    setConsumedAt(new Date().toISOString().slice(0, 16));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Caffeine Amount (mg)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="e.g., 95 for a cup of coffee"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="energyRating">Energy Rating (1-10)</Label>
        <Input
          id="energyRating"
          type="number"
          min="1"
          max="10"
          placeholder="Rate your energy level"
          value={energyRating}
          onChange={(e) => setEnergyRating(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="consumedAt">Time Consumed</Label>
        <Input
          id="consumedAt"
          type="datetime-local"
          value={consumedAt}
          onChange={(e) => setConsumedAt(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Log Intake
      </Button>
    </form>
  );
};