import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera, Effects } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { CarPhysics } from "./physics/CarPhysics";
import { ZenDriftAssetsGenerator } from "./ZenDriftAssetsGenerator";
import { supabase } from "@/integrations/supabase/client";

interface GameAsset {
  type: 'car' | 'background' | 'effect';
  image: HTMLImageElement;
  index: number;
}

export const ZenDrift = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [assets, setAssets] = useState<GameAsset[]>([]);
  const { toast } = useToast();

  const loadAssets = async () => {
    try {
      setIsLoadingAssets(true);
      setLoadingProgress(0);
      const newAssets: GameAsset[] = [];
      let totalAssets = 24; // 8 of each type
      let loadedAssets = 0;
      
      const assetTypes = [
        { type: 'car', count: 8 },
        { type: 'background', count: 8 },
        { type: 'effect', count: 8 }
      ];

      for (const { type, count } of assetTypes) {
        for (let i = 1; i <= count; i++) {
          try {
            const { data: { publicUrl } } = supabase.storage
              .from('game-assets')
              .getPublicUrl(`zen-drift/${type}s/${type}_${i}.png`);
              
            if (publicUrl) {
              const img = new Image();
              img.src = publicUrl;
              await new Promise((resolve, reject) => {
                img.onload = () => {
                  loadedAssets++;
                  setLoadingProgress(Math.round((loadedAssets / totalAssets) * 100));
                  resolve(true);
                };
                img.onerror = () => {
                  console.error(`Failed to load ${type}_${i}.png`);
                  reject(new Error(`Failed to load ${type}_${i}.png`));
                };
              });
              newAssets.push({ type: type as 'car' | 'background' | 'effect', image: img, index: i - 1 });
            }
          } catch (error) {
            console.error(`Error loading ${type}_${i}:`, error);
            // Continue loading other assets even if one fails
          }
        }
      }

      if (newAssets.length === 0) {
        throw new Error("No assets were loaded successfully");
      }

      setAssets(newAssets);
      console.log(`Loaded ${newAssets.length} assets successfully`);
      
      // Only show success toast if we loaded at least some assets
      if (newAssets.length > 0) {
        toast({
          title: "Assets Loaded",
          description: `Successfully loaded ${newAssets.length} game assets.`,
        });
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      toast({
        title: "Error Loading Assets",
        description: "Please try generating the assets first using the Generate Assets button.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAssets(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <Wind className="h-6 w-6 text-primary animate-float" />
          <h2 className="text-2xl font-semibold">Zen Drift</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="hover:bg-primary/10"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPaused(!isPaused)}
              className="hover:bg-primary/10"
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <ZenDriftAssetsGenerator />
        
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-primary/20 shadow-lg">
          {isLoadingAssets && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-primary mb-2">Loading assets... {loadingProgress}%</div>
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 15, 20]} />
            
            <ambientLight intensity={0.5} />
            <directionalLight
              castShadow
              position={[10, 10, 10]}
              intensity={1.5}
              shadow-mapSize={[2048, 2048]}
            />
            
            <CarPhysics
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1}
            />

            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.5, 0]}
            >
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial
                color="#a8e6cf"
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>

            <Environment preset="sunset" />
            
            <EffectComposer>
              <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={2}
                height={480}
              />
              <Bloom
                intensity={1.5}
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
              />
            </EffectComposer>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2.5}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </div>

        <motion.p 
          className="text-sm text-muted-foreground text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Find peace in motion. Use arrow keys to guide your journey, spacebar to embrace the drift. 
          Watch your energy levels and let the stars guide you.
        </motion.p>
      </div>
    </Card>
  );
};
