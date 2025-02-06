
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import type { AudioSettings } from "@/types/audio";

interface NoiseControlsProps {
  noiseType: AudioSettings['noiseType'];
  noiseVolume: number;
  onNoiseTypeChange: (type: AudioSettings['noiseType']) => void;
  onVolumeChange: (values: number[]) => void;
}

export const NoiseControls = ({
  noiseType,
  noiseVolume,
  onNoiseTypeChange,
  onVolumeChange
}: NoiseControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['white', 'pink', 'brown', 'off'] as const).map((type) => (
          <Button
            key={type}
            variant={noiseType === type ? "default" : "outline"}
            onClick={() => onNoiseTypeChange(type)}
            className="capitalize"
          >
            {type} Noise
          </Button>
        ))}
      </div>

      {noiseType !== 'off' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span className="text-sm font-medium">Noise Volume</span>
          </div>
          <Slider
            value={[noiseVolume]}
            onValueChange={onVolumeChange}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
