import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Flower, Loader2 } from "lucide-react";
import { BreathingTechniques, type BreathingTechnique } from "@/components/breathing/BreathingTechniques";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  image?: HTMLImageElement;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const ZenGarden = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [duration, setDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [zenElements, setZenElements] = useState<HTMLImageElement[]>([]);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [phaseTime, setPhaseTime] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const timerRef = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();
  const { session } = useAuth();

  const colors = [
    '#ffdde1', // Soft pink
    '#E2F0CB', // Mint
    '#B5EAD7', // Sage
    '#C7CEEA', // Periwinkle
    '#F7D794', // Soft yellow
    '#DAE3F3', // Soft blue
  ];

  const loadZenElements = async () => {
    setIsLoadingAssets(true);
    try {
      const elementTypes = ['stone', 'sand-pattern', 'bonsai', 'moss', 'bamboo', 'lantern', 'bridge', 'koi'];
      const newElements: HTMLImageElement[] = [];

      for (const type of elementTypes) {
        try {
          const { data: publicUrl } = await supabase
            .storage
            .from('game-assets')
            .getPublicUrl(`zen-garden/${type}.png`);

          if (!publicUrl.publicUrl) {
            throw new Error(`No public URL received for ${type}`);
          }

          const img = new Image();
          img.src = publicUrl.publicUrl;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => {
              console.warn(`Failed to load ${type}, using fallback`);
              reject(new Error(`Failed to load ${type}`));
            };
          });
          
          newElements.push(img);
          console.log(`Successfully loaded ${type}`);
        } catch (error) {
          console.warn(`Error loading ${type}, using fallback:`, error);
          // Use a placeholder image
          const placeholderImg = new Image();
          placeholderImg.src = 'https://images.unsplash.com/photo-1501854140801-50d01698950b';
          newElements.push(placeholderImg);
        }
      }

      setZenElements(newElements);
    } catch (error) {
      console.error('Error loading zen elements:', error);
      toast({
        title: "Error Loading Assets",
        description: "Using fallback images. You can still enjoy the experience.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAssets(false);
    }
  };

  useEffect(() => {
    loadZenElements();
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
    if (!selectedTechnique) {
      toast({
        title: "Please select a breathing technique",
        description: "Choose a breathing technique before starting the experience",
        variant: "destructive",
      });
      return;
    }

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

  const createParticle = (breathIntensity: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 10 + (breathIntensity / 10);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speed = 0.5 + (breathIntensity / 100);
    const angle = Math.random() * Math.PI * 2;
    const image = zenElements.length > 0 ? 
      zenElements[Math.floor(Math.random() * zenElements.length)] : 
      undefined;
    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = (Math.random() - 0.5) * 0.02;
    const opacity = Math.random() * 0.3 + 0.7;

    setParticles(prev => [...prev.slice(-50), { 
      x, y, size, color, speed, angle, image, 
      rotation, rotationSpeed, opacity 
    }]);
  };

  const updateParticles = (breathIntensity: number) => {
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        x: particle.x + Math.cos(particle.angle) * particle.speed * (breathIntensity / 50),
        y: particle.y + Math.sin(particle.angle) * particle.speed * (breathIntensity / 50),
        size: particle.size + (breathIntensity > 50 ? 0.1 : -0.1),
        rotation: particle.rotation + particle.rotationSpeed,
        opacity: Math.min(1, particle.opacity + (breathIntensity > 50 ? 0.02 : -0.02))
      })).filter(particle => particle.size > 0 && particle.opacity > 0)
    );
  };

  const detectBreathing = (): number => {
    if (!analyserRef.current) return 0;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    if (average > 50) {
      setBreathPhase('inhale');
    } else if (average > 30) {
      setBreathPhase('hold');
    } else if (average > 10) {
      setBreathPhase('exhale');
    } else {
      setBreathPhase('rest');
    }
    
    return average;
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

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#faf5ff');
    gradient.addColorStop(1, '#f0f7ff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      if (particle.image) {
        const size = particle.size * 5;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.drawImage(
          particle.image,
          -size/2,
          -size/2,
          size,
          size
        );
      } else {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      }
      
      ctx.restore();
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    const time = Date.now() / 1000;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        50 + i * 30 + Math.sin(time + i) * 10,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
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
        const focusRating = Math.min(Math.round((duration / 300) * 10), 10);

        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "breathing",
          activity_name: "Zen Garden",
          duration_minutes: Math.ceil(duration / 60),
          focus_rating: focusRating,
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
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Flower className={`h-5 w-5 text-primary ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Zen Garden
          </h2>
        </div>
        <div className="text-lg font-medium text-secondary">
          Time: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {!isPlaying && (
          <div className="w-full max-w-xl mb-4">
            <BreathingTechniques
              onSelectTechnique={setSelectedTechnique}
              className="mb-4"
            />
          </div>
        )}

        <div className="relative w-full">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border border-primary/10 rounded-lg w-full max-w-3xl bg-gradient-to-b from-[#faf5ff] to-[#f0f7ff] shadow-lg"
          />
          {isPlaying && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/80 px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
              <span className="text-primary font-medium animate-pulse">
                {breathPhase === 'inhale' ? 'Breathe In...' :
                 breathPhase === 'hold' ? 'Hold...' :
                 breathPhase === 'exhale' ? 'Breathe Out...' :
                 'Relax...'}
              </span>
            </div>
          )}
        </div>
        
        {!isPlaying ? (
          <Button 
            onClick={startExperience}
            className="w-40 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
            disabled={isSubmitting || audioSupported === false || isLoadingAssets}
          >
            {isLoadingAssets ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Start Experience'
            )}
          </Button>
        ) : (
          <Button 
            onClick={endExperience}
            variant="outline"
            className="w-40 border-primary/20 hover:bg-primary/5 transition-all duration-300"
            disabled={isSubmitting}
          >
            End Experience
          </Button>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground text-center max-w-2xl mx-auto">
        <p className="mb-2">
          Welcome to your personal Zen Garden. As you breathe, watch your garden come alive with
          peaceful elements inspired by traditional Japanese gardens.
        </p>
        <p>
          Each breath brings new life and movement to your space, creating a unique pattern of
          tranquility. Take this moment to find your inner peace.
        </p>
      </div>
    </Card>
  );
};

export default ZenGarden;
