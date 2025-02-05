import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePufferfishAssets } from '../PufferfishAssets';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  const { assets } = usePufferfishAssets();
  const [pufferPosition, setPufferPosition] = useState({ y: 50 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      const targetScale = breathPhase === 'inhale' ? 1.5 : 
                         breathPhase === 'hold' ? 1.3 : 1;
      const targetY = breathPhase === 'inhale' ? 40 : 
                     breathPhase === 'hold' ? 45 : 60;

      setScale(prev => {
        const diff = targetScale - prev;
        return prev + diff * 0.05; // Slower, more natural inflation
      });

      setPufferPosition(prev => ({
        y: prev.y + (targetY - prev.y) * 0.03 // Smoother vertical movement
      }));

      // Add subtle continuous rotation for 3D effect
      setRotation(prev => {
        const wobble = Math.sin(Date.now() / 1000) * 2;
        return wobble;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [breathPhase]);

  return (
    <div 
      className="relative w-full h-[600px] bg-cover bg-center rounded-lg overflow-hidden"
      style={{ backgroundImage: `url(${assets.background})` }}
    >
      {/* Pufferfish with enhanced 3D effect */}
      <div
        className={cn(
          "absolute w-32 h-32 transition-all duration-300",
          breathPhase === 'inhale' && "animate-float-up",
          breathPhase === 'exhale' && "animate-float-down",
          breathPhase === 'hold' && "animate-sway"
        )}
        style={{
          left: '20%',
          top: `${pufferPosition.y}%`,
          transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
          transition: 'transform 0.3s ease-out',
          filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={assets.pufferfish}
          alt="Pufferfish"
          className="w-full h-full object-contain mix-blend-multiply"
          style={{
            filter: `brightness(${1 + (scale - 1) * 0.2})`, // Subtle brightness change during inflation
            transform: `translateZ(${(scale - 1) * 20}px)`, // Push forward during inflation
          }}
        />
      </div>

      {/* Bubbles that appear during exhale */}
      {breathPhase === 'exhale' && (
        <div className="absolute left-[20%] top-[40%]">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-rise"
              style={{
                left: `${Math.random() * 40}px`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6,
              }}
            >
              <img
                src={assets.bubbles}
                alt="bubble"
                className="w-4 h-4 object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {/* Coral */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: '30%',
          backgroundImage: `url(${assets.coral})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          opacity: 0.8,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Seaweed Animation */}
      <div
        className="absolute bottom-0 left-1/4 w-16 h-32 origin-bottom animate-sway"
        style={{
          backgroundImage: `url(${assets.seaweed})`,
          backgroundSize: 'contain',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.9)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Additional Seaweed */}
      <div
        className="absolute bottom-0 left-3/4 w-16 h-24 origin-bottom animate-sway"
        style={{
          backgroundImage: `url(${assets.seaweed})`,
          backgroundSize: 'contain',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          animationDelay: '-1.5s',
          filter: 'brightness(0.85)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Breathing Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-6 py-2 rounded-full">
        <p className="text-blue-800 font-medium">
          {breathPhase === 'inhale' ? 'Breathe In' :
           breathPhase === 'hold' ? 'Hold' :
           breathPhase === 'exhale' ? 'Breathe Out' : 'Get Ready...'}
        </p>
      </div>
    </div>
  );
};

export default PufferfishScene3D;