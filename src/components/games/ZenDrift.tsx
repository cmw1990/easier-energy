import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ZenDriftAssetsGenerator } from "./ZenDriftAssetsGenerator";

export const ZenDrift = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { toast } = useToast();
  
  // Game state
  const gameState = useRef({
    car: {
      x: 0,
      y: 0,
      angle: 0,
      speed: 0,
      drift: 0,
      energy: 100
    },
    particles: [] as Array<{
      x: number;
      y: number;
      life: number;
      color: string;
      size: number;
      speed: number;
      angle: number;
    }>,
    trail: [] as Array<{
      x: number;
      y: number;
      age: number;
      width: number;
    }>,
    background: {
      gradient: 0,
      stars: Array.from({ length: 50 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        twinkle: Math.random()
      }))
    }
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      // Reinitialize stars on resize
      gameState.current.background.stars = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        twinkle: Math.random()
      }));
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize car position
    gameState.current.car.x = canvas.width / 2;
    gameState.current.car.y = canvas.height / 2;

    const pastelColors = [
      '#ffd6e0', // Soft pink
      '#ffefd6', // Soft orange
      '#e0f5ff', // Soft blue
      '#d6ffe0', // Soft green
      '#f5e0ff', // Soft purple
      '#fff5d6'  // Soft yellow
    ];

    const addParticle = (x: number, y: number, type: 'drift' | 'energy' = 'drift') => {
      const color = type === 'drift' 
        ? pastelColors[Math.floor(Math.random() * pastelColors.length)]
        : '#ffffff';
      
      const baseSize = type === 'drift' ? 5 : 2;
      const baseLife = type === 'drift' ? 1 : 0.8;
      
      gameState.current.particles.push({
        x,
        y,
        life: baseLife,
        color,
        size: Math.random() * baseSize + baseSize,
        speed: Math.random() * 2,
        angle: Math.random() * Math.PI * 2
      });
    };

    const drawBackground = () => {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const time = Date.now() / 10000;
      gradient.addColorStop(0, `hsl(${(time * 10) % 360}, 70%, 15%)`);
      gradient.addColorStop(1, `hsl(${((time * 10) + 60) % 360}, 70%, 25%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      gameState.current.background.stars.forEach(star => {
        const twinkle = Math.sin(Date.now() / 1000 + star.twinkle * 10) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
        ctx.fill();
      });
    };

    const updateAndDrawParticles = () => {
      ctx.globalAlpha = 0.6;
      gameState.current.particles = gameState.current.particles.filter(particle => {
        particle.life -= 0.01;
        if (particle.life <= 0) return false;

        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;
    };

    const updateAndDrawTrail = () => {
      const { car, trail } = gameState.current;
      
      // Add new trail point
      if (Math.abs(car.speed) > 0.1) {
        trail.push({ 
          x: car.x, 
          y: car.y, 
          age: 1,
          width: Math.abs(car.speed) * 0.5
        });
      }

      // Update and draw trail
      ctx.beginPath();
      trail.forEach((point, index) => {
        point.age -= 0.01;
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
        ctx.lineWidth = point.width * point.age;
      });
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ffd6e0');
      gradient.addColorStop(1, '#e0f5ff');
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Remove old trail points
      gameState.current.trail = trail.filter(point => point.age > 0);
    };

    const drawCar = () => {
      const { car } = gameState.current;
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);
      
      // Car glow
      const glowSize = 20 + Math.sin(Date.now() / 200) * 5;
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
      gradient.addColorStop(0, 'rgba(238, 156, 167, 0.4)');
      gradient.addColorStop(1, 'rgba(238, 156, 167, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Car body
      ctx.beginPath();
      ctx.roundRect(-15, -10, 30, 20, 5);
      ctx.fillStyle = '#ee9ca7';
      ctx.fill();
      
      // Energy indicator
      const energyGradient = ctx.createLinearGradient(-15, -12, -15 + (30 * car.energy/100), -12);
      energyGradient.addColorStop(0, '#4ade80');
      energyGradient.addColorStop(1, '#22c55e');
      ctx.fillStyle = energyGradient;
      ctx.fillRect(-15, -12, 30 * (car.energy/100), 2);
      
      ctx.restore();
    };

    // Sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createDriftSound = () => {
      if (isMuted) return;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200 + Math.abs(gameState.current.car.drift) * 50, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    let lastTime = 0;
    const gameLoop = (timestamp: number) => {
      if (isPaused) return;
      
      const deltaTime = lastTime ? (timestamp - lastTime) / 1000 : 0;
      lastTime = timestamp;

      // Clear canvas
      drawBackground();

      const { car } = gameState.current;

      // Update car physics
      if (keys.ArrowUp) {
        car.speed += deltaTime * 2;
        car.energy = Math.max(0, car.energy - deltaTime * 5);
      }
      if (keys.ArrowDown) {
        car.speed -= deltaTime * 2;
        car.energy = Math.max(0, car.energy - deltaTime * 5);
      }
      if (keys.ArrowLeft) car.angle -= deltaTime * 2;
      if (keys.ArrowRight) car.angle += deltaTime * 2;

      // Natural energy recovery
      if (!keys.ArrowUp && !keys.ArrowDown) {
        car.energy = Math.min(100, car.energy + deltaTime * 10);
      }

      // Apply drift
      car.drift *= 0.95;
      car.speed *= 0.99;
      car.x += Math.cos(car.angle) * car.speed + Math.cos(car.angle + Math.PI/2) * car.drift;
      car.y += Math.sin(car.angle) * car.speed + Math.sin(car.angle + Math.PI/2) * car.drift;

      // Keep car in bounds with smooth transition
      if (car.x < 0) car.x = canvas.width;
      if (car.x > canvas.width) car.x = 0;
      if (car.y < 0) car.y = canvas.height;
      if (car.y > canvas.height) car.y = 0;

      // Add particles based on speed and drift
      if (Math.abs(car.speed) > 0.5) {
        addParticle(
          car.x - Math.cos(car.angle) * 15, 
          car.y - Math.sin(car.angle) * 15,
          'drift'
        );
      }
      
      // Add energy particles
      if (car.energy < 30) {
        addParticle(car.x, car.y, 'energy');
      }

      updateAndDrawTrail();
      updateAndDrawParticles();
      drawCar();

      requestAnimationFrame(gameLoop);
    };

    // Handle keyboard input
    const keys: { [key: string]: boolean } = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (e.key === ' ') {
        gameState.current.car.drift = gameState.current.car.speed;
        createDriftSound();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Start game loop
    requestAnimationFrame(gameLoop);

    toast({
      title: "Zen Drift Enhanced",
      description: "Experience the calming flow with new visual effects and energy management.",
    });

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, isMuted]);

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
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ touchAction: 'none' }}
          />
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