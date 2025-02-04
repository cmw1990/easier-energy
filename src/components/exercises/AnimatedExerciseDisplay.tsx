import { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from 'react-error-boundary';

interface AnimatedExerciseDisplayProps {
  imageUrl: string;
  exerciseType: string;
  animationType?: 'css' | 'svg' | '3d';
  isActive?: boolean;
  progress?: number;
}

const ExerciseScene = ({ imageUrl }: { imageUrl: string }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (loadedTexture) => {
      setTexture(loadedTexture);
    });

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl]);

  if (!texture) {
    return null;
  }

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial ref={materialRef} map={texture} transparent />
    </mesh>
  );
};

const Fallback = ({ imageUrl }: { imageUrl: string }) => (
  <img 
    src={imageUrl} 
    alt="Exercise" 
    className="w-full h-full object-contain animate-pulse"
  />
);

const SVGAnimation = ({ exerciseType, progress = 0 }: { exerciseType: string; progress?: number }) => {
  const getAnimationPath = () => {
    switch (exerciseType) {
      case 'stretch':
        return "M10 50 Q 50 10, 90 50 T 170 50";
      case 'strength':
        return "M10 50 L 90 10 L 170 50";
      default:
        return "M10 50 L 90 50 L 170 50";
    }
  };

  return (
    <svg className="w-full h-full" viewBox="0 0 180 100">
      <defs>
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset={`${progress}%`} stopColor="currentColor" />
          <stop offset={`${progress}%`} stopColor="rgba(0,0,0,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </linearGradient>
      </defs>
      <path
        d={getAnimationPath()}
        fill="none"
        stroke="url(#progress-gradient)"
        strokeWidth="2"
        className={cn(
          "transition-all duration-300",
          exerciseType === 'stretch' ? "animate-exercise-stretch" : "animate-exercise-pulse"
        )}
      />
    </svg>
  );
};

export const AnimatedExerciseDisplay = ({
  imageUrl,
  exerciseType,
  animationType = 'css',
  isActive = false,
  progress = 0
}: AnimatedExerciseDisplayProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [nextRippleId, setNextRippleId] = useState(0);

  useEffect(() => {
    if (progress >= 100 && !showAchievement) {
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 2000);
    }
  }, [progress]);

  const handleInteraction = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: nextRippleId };
    setRipples(prev => [...prev, newRipple]);
    setNextRippleId(prev => prev + 1);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  };

  const getAnimationClass = () => {
    const baseAnimation = {
      stretch: 'animate-exercise-stretch',
      strength: 'animate-exercise-pulse'
    }[exerciseType] || 'animate-exercise-rotate';

    return cn(
      baseAnimation,
      isActive && 'scale-110 transition-transform duration-300',
      'hover:scale-105 transition-all duration-300'
    );
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full aspect-square rounded-lg overflow-hidden",
        isActive ? "ring-2 ring-primary shadow-lg" : "hover:ring-1 hover:ring-primary/50",
        "transition-all duration-300 cursor-pointer",
        "bg-gradient-to-br from-primary/10 to-secondary/10"
      )}
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
    >
      {animationType === 'css' && (
        <img
          src={imageUrl}
          alt={`${exerciseType} exercise`}
          className={getAnimationClass()}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {animationType === 'svg' && (
        <div className="relative w-full h-full">
          <SVGAnimation exerciseType={exerciseType} progress={progress} />
          <img
            src={imageUrl}
            alt={`${exerciseType} exercise`}
            className="absolute inset-0 w-full h-full object-contain mix-blend-multiply"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      )}

      {animationType === '3d' && (
        <ErrorBoundary fallback={<Fallback imageUrl={imageUrl} />}>
          <Canvas
            camera={{ position: [0, 0, 5] }}
            gl={{ 
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: true
            }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <ExerciseScene imageUrl={imageUrl} />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      )}

      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute w-4 h-4 bg-primary/20 rounded-full animate-ripple"
          style={{
            left: ripple.x - 8,
            top: ripple.y - 8,
          }}
        />
      ))}

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isActive && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-background/80 backdrop-blur-sm rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 animate-pulse"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {showAchievement && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 animate-fade-in backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2 animate-scale-in">
            <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
            <Star className="w-6 h-6 text-yellow-400 animate-spin" />
            <span className="text-white font-bold">Exercise Complete!</span>
          </div>
        </div>
      )}
    </div>
  );
};
