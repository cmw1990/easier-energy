
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AdBlockingControls() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [cosmeticFiltering, setCosmeticFiltering] = useState(true);
  const [scriptBlocking, setScriptBlocking] = useState(true);

  const handleClearStats = () => {
    toast({
      title: "Stats cleared",
      description: "Your ad blocking statistics have been reset."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Blocking Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ad Blocking</Label>
              <p className="text-sm text-muted-foreground">Enable or disable ad blocking</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Strict Mode</Label>
              <p className="text-sm text-muted-foreground">Aggressive blocking of potential ads</p>
            </div>
            <Switch checked={strictMode} onCheckedChange={setStrictMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cosmetic Filtering</Label>
              <p className="text-sm text-muted-foreground">Remove empty spaces and overlays</p>
            </div>
            <Switch checked={cosmeticFiltering} onCheckedChange={setCosmeticFiltering} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Script Blocking</Label>
              <p className="text-sm text-muted-foreground">Block potentially harmful scripts</p>
            </div>
            <Switch checked={scriptBlocking} onCheckedChange={setScriptBlocking} />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClearStats}>
              Clear Statistics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
