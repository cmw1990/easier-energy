import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2, RefreshCw } from "lucide-react";
import { useZenGardenAssets } from "./ZenGardenAssets";
import { GameAssetsGenerator } from "@/components/GameAssetsGenerator";

const ZenGarden = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<any>(null);
  const { toast } = useToast();

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const fetchedAssets = await useZenGardenAssets();
      setAssets(fetchedAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Error",
        description: "Failed to load assets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Zen Garden</h2>
        <GameAssetsGenerator />
        <Button onClick={fetchAssets} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Assets
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading assets...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {assets && assets.map((asset: any) => (
            <div key={asset.id} className="border p-4 rounded">
              <img src={asset.url} alt={asset.name} className="w-full h-auto" />
              <h3 className="text-lg font-semibold">{asset.name}</h3>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ZenGarden;
