import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wind } from "lucide-react";

export type BreathingTechnique = {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    holdAfterExhale?: number;
  };
  bestFor: string[];
};

const breathingTechniques: BreathingTechnique[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal duration for inhale, hold, exhale, and hold - creating a square pattern.",
    benefits: [
      "Reduces stress and anxiety",
      "Improves concentration",
      "Helps manage emotions"
    ],
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4
    },
    bestFor: [
      "Before stressful situations",
      "During work breaks",
      "When feeling overwhelmed"
    ]
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8 - a natural tranquilizer for the nervous system.",
    benefits: [
      "Promotes better sleep",
      "Reduces anxiety",
      "Helps control cravings"
    ],
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8
    },
    bestFor: [
      "Before bedtime",
      "During stress or anxiety",
      "When experiencing cravings"
    ]
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Simple 5-5 pattern that balances the autonomic nervous system.",
    benefits: [
      "Improves heart rate variability",
      "Reduces stress",
      "Increases energy"
    ],
    pattern: {
      inhale: 5,
      exhale: 5
    },
    bestFor: [
      "Daily practice",
      "During meditation",
      "When feeling tired"
    ]
  },
  {
    id: "alternate",
    name: "Alternate Nostril",
    description: "Alternating breath between nostrils to balance both brain hemispheres.",
    benefits: [
      "Improves focus",
      "Balances energy",
      "Reduces stress"
    ],
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4
    },
    bestFor: [
      "Before meditation",
      "When needing focus",
      "To balance energy"
    ]
  }
];

export interface BreathingTechniquesProps {
  onSelectTechnique?: (technique: BreathingTechnique) => void;
  className?: string;
}

export const BreathingTechniques = ({ onSelectTechnique, className = "" }: BreathingTechniquesProps) => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(breathingTechniques[0]);

  const handleTechniqueChange = (techniqueId: string) => {
    const technique = breathingTechniques.find(t => t.id === techniqueId) || breathingTechniques[0];
    setSelectedTechnique(technique);
    if (onSelectTechnique) {
      onSelectTechnique(technique);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Breathing Technique
        </CardTitle>
        <CardDescription>
          Select a breathing technique that suits your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedTechnique.id}
          onValueChange={handleTechniqueChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a technique" />
          </SelectTrigger>
          <SelectContent>
            {breathingTechniques.map((technique) => (
              <SelectItem key={technique.id} value={technique.id}>
                {technique.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{selectedTechnique.description}</p>
          </div>

          <div>
            <h4 className="font-medium">Benefits</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {selectedTechnique.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Best Used For</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {selectedTechnique.bestFor.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Pattern</h4>
            <div className="text-sm text-muted-foreground">
              <p>Inhale: {selectedTechnique.pattern.inhale} seconds</p>
              {selectedTechnique.pattern.hold && (
                <p>Hold: {selectedTechnique.pattern.hold} seconds</p>
              )}
              <p>Exhale: {selectedTechnique.pattern.exhale} seconds</p>
              {selectedTechnique.pattern.holdAfterExhale && (
                <p>Hold after exhale: {selectedTechnique.pattern.holdAfterExhale} seconds</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { breathingTechniques };

export default BreathingTechniques;
