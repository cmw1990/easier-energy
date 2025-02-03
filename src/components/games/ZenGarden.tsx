import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Flower } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
}

const ZenGarden = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [duration, setDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const timerRef = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();
  const { session } = useAuth();

  const colors = [
    '#FF9AA2', // Soft red
    '#FFB7B2', // Coral
    '#FFDAC1', // Peach
    '#E2F0CB', // Mint
    '#B5EAD7', // Sage
    '#C7CEEA', // Periwinkle
  ];

  useEffect(() => {
    const checkAudioSupport = async () => {
      try {
        const supported = !!(
          navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia &&
          window.AudioContext
        );
        setAudioSupported(supported);
      } catch (error) {
        console.error("Error checking audio support:", error);
        setAudioSupported(false);
      }
    };
    checkAudioSupport();
  }, []);

  const startExperience = async () => {
    try {
      if (!audioSupported) {
        throw new Error("Audio input is not supported on this device/browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      setIsPlaying(true);
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      animationLoop();
      
      toast({
        title: "Experience Started",
        description: "Breathe deeply and watch your garden grow.",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error Starting Experience",
        description: error.message || "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const detectBreathing = (): number => {
    if (!analyserRef.current) return 0;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return average;
  };

  const createParticle = (breathIntensity: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 10 + (breathIntensity / 10);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speed = 0.5 + (breathIntensity / 100);
    const angle = Math.random() * Math.PI * 2;

    setParticles(prev => [...prev.slice(-50), { x, y, size, color, speed, angle }]);
  };

  const updateParticles = (breathIntensity: number) => {
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        x: particle.x + Math.cos(particle.angle) * particle.speed * (breathIntensity / 50),
        y: particle.y + Math.sin(particle.angle) * particle.speed * (breathIntensity / 50),
        size: particle.size + (breathIntensity > 50 ? 0.1 : -0.1),
      })).filter(particle => particle.size > 0)
    );
  };

  const animationLoop = () => {
    const breathIntensity = detectBreathing();
    
    if (breathIntensity > 30) {
      createParticle(breathIntensity);
    }
    
    updateParticles(breathIntensity);
    drawScene();
    
    animationFrameRef.current = requestAnimationFrame(animationLoop);
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
  };

  const endExperience = async () => {
    setIsPlaying(false);
    setIsSubmitting(true);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "Zen Garden",
          duration_minutes: Math.ceil(duration / 60),
          focus_rating: Math.round((duration / 300) * 10), // 5 minutes = max score
          energy_rating: null,
          notes: `Completed Zen Garden meditation for ${Math.ceil(duration / 60)} minutes`
        });

        if (error) throw error;

        toast({
          title: "Session Complete",
          description: `You spent ${Math.ceil(duration / 60)} minutes in your garden. Wonderful job!`,
        });
      } catch (error) {
        console.error("Error logging meditation:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your session results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setParticles([]);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Flower className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Zen Garden</h2>
        </div>
        <div className="text-lg">
          Time: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="border border-gray-200 rounded-lg w-full max-w-3xl bg-gradient-to-b from-blue-50 to-green-50"
        />
        
        {!isPlaying ? (
          <>
            <Button 
              onClick={startExperience}
              className="w-40"
              disabled={isSubmitting || audioSupported === false}
            >
              Start Experience
            </Button>
            {audioSupported === false && (
              <p className="text-destructive text-sm">
                Audio input is not supported on your device or browser.
                Please try using a different browser or device.
              </p>
            )}
          </>
        ) : (
          <Button 
            onClick={endExperience}
            variant="outline"
            className="w-40"
            disabled={isSubmitting}
          >
            End Experience
          </Button>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Breathe deeply and watch as your breath creates a beautiful, dynamic garden.
        Each breath brings new life and movement to your personal zen space.
      </div>
    </Card>
  );
};

export default ZenGarden;