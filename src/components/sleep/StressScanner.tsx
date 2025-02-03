import { useState, useEffect, useRef } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Motion } from '@capacitor/motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PPGDataPoint {
  timestamp: number;
  value: number;
}

interface HRVMetrics {
  sdnn: number;  // Standard deviation of NN intervals
  rmssd: number; // Root mean square of successive differences
  pnn50: number; // Proportion of NN50 divided by total number of NNs
  meanHR: number; // Mean heart rate
}

export const StressScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [hrvMetrics, setHrvMetrics] = useState<HRVMetrics | null>(null);
  const [signalQuality, setSignalQuality] = useState<number>(0);
  const { toast } = useToast();
  
  const ppgDataRef = useRef<PPGDataPoint[]>([]);
  const frameRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const processFrame = (imageData: ImageData) => {
    const data = imageData.data;
    let redSum = 0;
    
    // Extract red channel average (PPG signal)
    for (let i = 0; i < data.length; i += 4) {
      redSum += data[i];
    }
    
    const ppgValue = redSum / (data.length / 4);
    ppgDataRef.current.push({
      timestamp: Date.now(),
      value: ppgValue
    });
  };

  const calculateHRV = (ppgData: PPGDataPoint[]): HRVMetrics => {
    // Calculate RR intervals from PPG peaks
    const peaks = findPeaks(ppgData.map(p => p.value));
    const rrIntervals = [];
    
    for (let i = 1; i < peaks.length; i++) {
      const interval = ppgData[peaks[i]].timestamp - ppgData[peaks[i-1]].timestamp;
      if (interval > 300 && interval < 1500) { // Valid RR interval range (ms)
        rrIntervals.push(interval);
      }
    }

    // Calculate HRV metrics
    const sdnn = calculateSDNN(rrIntervals);
    const rmssd = calculateRMSSD(rrIntervals);
    const pnn50 = calculatePNN50(rrIntervals);
    const meanHR = 60000 / (rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length);

    return { sdnn, rmssd, pnn50, meanHR };
  };

  const findPeaks = (signal: number[]): number[] => {
    const peaks: number[] = [];
    const windowSize = 10;
    
    for (let i = windowSize; i < signal.length - windowSize; i++) {
      const window = signal.slice(i - windowSize, i + windowSize);
      if (signal[i] === Math.max(...window)) {
        peaks.push(i);
      }
    }
    
    return peaks;
  };

  const calculateSDNN = (intervals: number[]): number => {
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const squaredDiffs = intervals.map(i => Math.pow(i - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / intervals.length);
  };

  const calculateRMSSD = (intervals: number[]): number => {
    let sumSquaredDiffs = 0;
    for (let i = 1; i < intervals.length; i++) {
      sumSquaredDiffs += Math.pow(intervals[i] - intervals[i-1], 2);
    }
    return Math.sqrt(sumSquaredDiffs / (intervals.length - 1));
  };

  const calculatePNN50 = (intervals: number[]): number => {
    let nn50Count = 0;
    for (let i = 1; i < intervals.length; i++) {
      if (Math.abs(intervals[i] - intervals[i-1]) > 50) {
        nn50Count++;
      }
    }
    return (nn50Count / (intervals.length - 1)) * 100;
  };

  const calculateStressLevel = (metrics: HRVMetrics): number => {
    // Stress level calculation based on HRV metrics
    // Lower SDNN and RMSSD indicate higher stress
    const sdnnNorm = Math.min(Math.max((metrics.sdnn - 20) / (100 - 20), 0), 1);
    const rmssdNorm = Math.min(Math.max((metrics.rmssd - 15) / (80 - 15), 0), 1);
    const pnn50Norm = metrics.pnn50 / 100;
    
    // Weighted average of normalized metrics
    const stressScore = (1 - (sdnnNorm * 0.4 + rmssdNorm * 0.4 + pnn50Norm * 0.2)) * 100;
    return Math.round(stressScore);
  };

  const assessSignalQuality = (ppgData: PPGDataPoint[]): number => {
    if (ppgData.length < 2) return 0;
    
    // Calculate signal variance and noise metrics
    const values = ppgData.map(p => p.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    
    // Higher variance indicates better signal (more pulsatile component)
    const qualityScore = Math.min(Math.max((variance - 100) / 1000, 0), 1) * 100;
    return Math.round(qualityScore);
  };

  const startScan = async () => {
    try {
      setIsScanning(true);
      setProgress(0);
      setStressLevel(null);
      setHrvMetrics(null);
      ppgDataRef.current = [];

      // Request camera permissions
      const permissionStatus = await Camera.checkPermissions();
      if (permissionStatus.camera !== 'granted') {
        await Camera.requestPermissions();
      }

      // Initialize canvas for video processing
      if (canvasRef.current) {
        contextRef.current = canvasRef.current.getContext('2d');
      }

      // Start motion detection
      await Motion.addListener('accel', (event) => {
        if (Math.abs(event.acceleration.x) > 0.5 || 
            Math.abs(event.acceleration.y) > 0.5 || 
            Math.abs(event.acceleration.z) > 0.5) {
          setSignalQuality(prev => Math.max(0, prev - 5));
          toast({
            title: "Movement detected",
            description: "Please keep your finger still for accurate readings",
            variant: "destructive",
          });
        }
      });

      // Start camera preview
      const video = document.createElement('video');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      video.srcObject = stream;
      video.play();

      // Process frames
      const processFrames = () => {
        if (!isScanning) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (contextRef.current && canvasRef.current && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
          contextRef.current.drawImage(video, 0, 0);
          
          const imageData = contextRef.current.getImageData(
            0, 0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          
          processFrame(imageData);
          
          // Update progress and signal quality
          setProgress(prev => {
            const newProgress = prev + (100 / (30 * 20)); // 20 seconds duration
            if (newProgress >= 100) {
              finishScan();
              return 100;
            }
            return newProgress;
          });
          
          setSignalQuality(assessSignalQuality(ppgDataRef.current));
        }

        frameRef.current = requestAnimationFrame(processFrames);
      };

      frameRef.current = requestAnimationFrame(processFrames);

    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        title: "Error",
        description: "Failed to start stress scan. Please ensure camera access is granted.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const finishScan = () => {
    if (ppgDataRef.current.length < 100) {
      toast({
        title: "Scan Failed",
        description: "Not enough data collected. Please try again.",
        variant: "destructive",
      });
      setIsScanning(false);
      return;
    }

    const metrics = calculateHRV(ppgDataRef.current);
    setHrvMetrics(metrics);
    const calculatedStress = calculateStressLevel(metrics);
    setStressLevel(calculatedStress);
    
    setIsScanning(false);
    Motion.removeAllListeners();
    cancelAnimationFrame(frameRef.current);
    
    toast({
      title: "Scan Complete",
      description: `Your stress level has been measured`,
    });
  };

  useEffect(() => {
    return () => {
      Motion.removeAllListeners();
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Advanced Stress Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <canvas ref={canvasRef} className="hidden" />
          
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
              <div className="flex items-center justify-between text-sm">
                <span>Signal Quality: {signalQuality}%</span>
                <span>Progress: {Math.round(progress)}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p>Place your finger on the camera lens and keep still...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Stress Level</p>
                  <p className="text-2xl font-bold">{stressLevel}%</p>
                </div>
                {hrvMetrics && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Mean HR</p>
                    <p className="text-2xl font-bold">{Math.round(hrvMetrics.meanHR)} bpm</p>
                  </div>
                )}
              </div>
              
              {hrvMetrics && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">SDNN</p>
                    <p>{Math.round(hrvMetrics.sdnn)} ms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">RMSSD</p>
                    <p>{Math.round(hrvMetrics.rmssd)} ms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">pNN50</p>
                    <p>{Math.round(hrvMetrics.pnn50)}%</p>
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                {stressLevel && stressLevel > 70 ? (
                  "High stress detected. Your HRV metrics indicate elevated stress levels. Consider deep breathing exercises or meditation."
                ) : stressLevel && stressLevel > 30 ? (
                  "Moderate stress levels. Your HRV indicates some stress, but it's within manageable levels. Regular breaks may help."
                ) : (
                  "Your stress levels are well managed. Your HRV metrics indicate good autonomic balance."
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