import { useState, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Motion } from '@capacitor/motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const StressScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [hrv, setHrv] = useState<number | null>(null);
  const { toast } = useToast();

  const startScan = async () => {
    try {
      setIsScanning(true);
      setProgress(0);
      setStressLevel(null);
      setHrv(null);

      // Request camera permissions
      const permissionStatus = await Camera.checkPermissions();
      if (permissionStatus.camera !== 'granted') {
        await Camera.requestPermissions();
      }

      // Start motion detection to ensure stable readings
      await Motion.addListener('accel', (event) => {
        if (Math.abs(event.acceleration.x) > 1 || 
            Math.abs(event.acceleration.y) > 1 || 
            Math.abs(event.acceleration.z) > 1) {
          toast({
            title: "Keep your finger still",
            description: "Try to minimize movement for accurate readings",
          });
        }
      });

      // Simulate HRV measurement (in a real app, this would analyze camera feed)
      const duration = 30; // 30 seconds scan
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            finishScan();
            return 100;
          }
          return prev + (100 / duration);
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        title: "Error",
        description: "Failed to start stress scan. Please try again.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const finishScan = () => {
    // Simulate HRV calculation (in a real app, this would be based on PPG analysis)
    const simulatedHrv = Math.floor(Math.random() * (80 - 40) + 40);
    setHrv(simulatedHrv);
    
    // Calculate stress level (0-100) based on HRV
    // Lower HRV typically indicates higher stress
    const calculatedStress = Math.floor(100 - ((simulatedHrv - 40) / 40 * 100));
    setStressLevel(calculatedStress);
    
    setIsScanning(false);
    Motion.removeAllListeners();
    
    toast({
      title: "Scan Complete",
      description: `Your stress level has been measured`,
    });
  };

  useEffect(() => {
    return () => {
      Motion.removeAllListeners();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Stress Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isScanning && !stressLevel ? (
            <Button 
              onClick={startScan} 
              className="w-full"
              disabled={isScanning}
            >
              Start Stress Scan
            </Button>
          ) : isScanning ? (
            <div className="space-y-4">
              <Progress value={progress} />
              <p className="text-center text-sm text-muted-foreground">
                Place your finger on the camera lens and keep still...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Stress Level</p>
                  <p className="text-2xl font-bold">{stressLevel}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">HRV</p>
                  <p className="text-2xl font-bold">{hrv} ms</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {stressLevel && stressLevel > 70 ? (
                  "High stress detected. Consider taking a break or trying some relaxation exercises."
                ) : stressLevel && stressLevel > 30 ? (
                  "Moderate stress levels. Remember to take regular breaks and practice deep breathing."
                ) : (
                  "Your stress levels appear to be well managed. Keep up the good work!"
                )}
              </div>
              <Button 
                onClick={startScan} 
                variant="outline"
                className="w-full"
              >
                Scan Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};