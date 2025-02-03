import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Pause, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ZenDrift = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  
  // Game state
  const gameState = useRef({
    car: {
      x: 0,
      y: 0,
      angle: 0,
      speed: 0,
      drift: 0
    },
    particles: [] as Array<{
      x: number;
      y: number;
      life: number;
      color: string;
    }>,
    trail: [] as Array<{
      x: number;
      y: number;
      age: number;
    }>
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
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
      '#f5e0ff'  // Soft purple
    ];

    const addParticle = (x: number, y: number) => {
      gameState.current.particles.push({
        x,
        y,
        life: 1,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)]
      });
    };

    const updateAndDrawParticles = () => {
      ctx.globalAlpha = 0.6;
      gameState.current.particles = gameState.current.particles.filter(particle => {
        particle.life -= 0.01;
        if (particle.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.life * 5, 0, Math.PI * 2);
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
        trail.push({ x: car.x, y: car.y, age: 1 });
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
      });
      
      ctx.strokeStyle = '#ffd6e0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Remove old trail points
      gameState.current.trail = trail.filter(point => point.age > 0);
    };

    const drawCar = () => {
      const { car } = gameState.current;
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);
      
      // Car body
      ctx.beginPath();
      ctx.roundRect(-15, -10, 30, 20, 5);
      ctx.fillStyle = '#ee9ca7';
      ctx.fill();
      
      ctx.restore();
    };

    let lastTime = 0;
    const gameLoop = (timestamp: number) => {
      if (isPaused) return;
      
      const deltaTime = lastTime ? (timestamp - lastTime) / 1000 : 0;
      lastTime = timestamp;

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { car } = gameState.current;

      // Update car physics
      if (keys.ArrowUp) car.speed += deltaTime * 2;
      if (keys.ArrowDown) car.speed -= deltaTime * 2;
      if (keys.ArrowLeft) car.angle -= deltaTime * 2;
      if (keys.ArrowRight) car.angle += deltaTime * 2;

      // Apply drift
      car.drift *= 0.95;
      car.speed *= 0.99;
      car.x += Math.cos(car.angle) * car.speed + Math.cos(car.angle + Math.PI/2) * car.drift;
      car.y += Math.sin(car.angle) * car.speed + Math.sin(car.angle + Math.PI/2) * car.drift;

      // Keep car in bounds
      car.x = (car.x + canvas.width) % canvas.width;
      car.y = (car.y + canvas.height) % canvas.height;

      // Add particles based on speed
      if (Math.abs(car.speed) > 0.5) {
        addParticle(car.x, car.y);
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
      title: "Zen Drift",
      description: "Use arrow keys to move, spacebar to drift. Find your flow.",
    });

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused]);

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <Wind className="h-6 w-6 text-primary animate-float" />
          <h2 className="text-2xl font-semibold">Zen Drift</h2>
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
        </motion.p>
      </div>
    </Card>
  );
};
