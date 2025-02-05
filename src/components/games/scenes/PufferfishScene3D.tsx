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

  useEffect(() => {
    const targetScale = breathPhase === 'inhale' ? 1.5 : 
                       breathPhase === 'hold' ? 1.3 : 1;
    const targetY = breathPhase === 'inhale' ? 40 : 
                   breathPhase === 'hold' ? 45 : 60;

    const animation = requestAnimationFrame(() => {
      setScale(prev => {
        const diff = targetScale - prev;
        return prev + diff * 0.1;
      });
      setPufferPosition(prev => ({
        y: prev.y + (targetY - prev.y) * 0.1
      }));
    });

    return () => cancelAnimationFrame(animation);
  }, [breathPhase, scale, pufferPosition.y]);

  return (
    <div 
      className="relative w-full h-[600px] bg-cover bg-center rounded-lg overflow-hidden"
      style={{ backgroundImage: `url(${assets.background})` }}
    >
      {/* Pufferfish */}
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
          transform: `translate(-50%, -50%) scale(${scale})`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <img
          src={assets.pufferfish}
          alt="Pufferfish"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Coral */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: '30%',
          backgroundImage: `url(${assets.coral})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          opacity: 0.8
        }}
      />

      {/* Seaweed Animation */}
      <div
        className="absolute bottom-0 left-1/4 w-16 h-32 origin-bottom animate-sway"
        style={{
          backgroundImage: `url(${assets.seaweed})`,
          backgroundSize: 'contain',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat'
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
          animationDelay: '-1.5s'
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