
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Waves } from "lucide-react";

interface BinauralControlsProps {
  binauralFrequency: number | null;
  binauralVolume: number;
  onFrequencyChange: (freq: number | null) => void;
  onVolumeChange: (values: number[]) => void;
}

export const BinauralControls = ({
  binauralFrequency,
  binauralVolume,
  onFrequencyChange,
  onVolumeChange
}: BinauralControlsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Waves className="h-4 w-4" />
        <span className="text-sm font-medium">Binaural Beats</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {[4, 8, 12, 16].map((freq) => (
          <Button
            key={freq}
            variant={binauralFrequency === freq ? "default" : "outline"}
            onClick={() => onFrequencyChange(freq)}
          >
            {freq}Hz
          </Button>
        ))}
        <Button
          variant={binauralFrequency === null ? "default" : "outline"}
          onClick={() => onFrequencyChange(null)}
        >
          Off
        </Button>
      </div>
      {binauralFrequency && (
        <Slider
          value={[binauralVolume]}
          onValueChange={onVolumeChange}
          max={1}
          step={0.01}
          className="w-full"
        />
      )}
    </div>
  );
};
