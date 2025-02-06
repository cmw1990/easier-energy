
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music2 } from "lucide-react";
import type { NatureSound } from "@/utils/audio/natureTypes";

interface NatureSoundControlsProps {
  natureSoundType: NatureSound | null;
  natureSoundVolume: number;
  onNatureSoundChange: (type: NatureSound | null) => void;
  onVolumeChange: (values: number[]) => void;
}

export const NatureSoundControls = ({
  natureSoundType,
  natureSoundVolume,
  onNatureSoundChange,
  onVolumeChange
}: NatureSoundControlsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Music2 className="h-4 w-4" />
        <span className="text-sm font-medium">Nature Sounds</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {(['rain', 'ocean', 'forest', 'stream', 'wind'] as NatureSound[]).map((type) => (
          <Button
            key={type}
            variant={natureSoundType === type ? "default" : "outline"}
            onClick={() => onNatureSoundChange(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
        <Button
          variant={natureSoundType === null ? "default" : "outline"}
          onClick={() => onNatureSoundChange(null)}
        >
          Off
        </Button>
      </div>
      {natureSoundType && (
        <Slider
          value={[natureSoundVolume]}
          onValueChange={onVolumeChange}
          max={1}
          step={0.01}
          className="w-full"
        />
      )}
    </div>
  );
};
