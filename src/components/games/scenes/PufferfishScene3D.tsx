import React, { useEffect, useState } from 'react';
import { usePufferfishAssets } from '../PufferfishAssets';
import { cn } from '@/lib/utils';

interface PufferfishProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

const PufferfishScene3D: React.FC<PufferfishProps> = ({ breathPhase }) => {
  const { assets, isLoading } = usePufferfishAssets();
  const [instruction, setInstruction] = useState('Get ready...');

  // Get scale and color based on breath phase
  const getScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.3;
      case 'exhale': return 1.0;
      default: return 1.2;
    }
  };

  // Update breathing instructions
  useEffect(() => {
    switch (breathPhase) {
      case 'inhale':
        setInstruction('Breathe in slowly...');
        break;
      case 'hold':
        setInstruction('Hold your breath...');
        break;
      case 'exhale':
        setInstruction('Breathe out gently...');
        break;
      default:
        setInstruction('Get ready...');
    }
  }, [breathPhase]);

  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg overflow-hidden">
      {/* Ocean background */}
      <div className="absolute inset-0">
        <img 
          src={assets.background} 
          alt="Ocean background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Seaweed decorations */}
      <div className="absolute bottom-0 left-0 w-1/4">
        <img 
          src={assets.seaweed} 
          alt="Seaweed"
          className="w-full animate-sway"
        />
      </div>

      {/* Small fish swimming */}
      <div className="absolute top-1/4 right-0 w-1/6">
        <img 
          src={assets.smallFish} 
          alt="Small fish"
          className="w-full animate-swim"
        />
      </div>

      {/* Pufferfish container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={cn(
            "relative transition-all duration-700 ease-in-out",
            breathPhase === 'inhale' && "animate-float-up",
            breathPhase === 'exhale' && "animate-float-down"
          )}
          style={{
            transform: `scale(${getScale()})`,
          }}
        >
          <img 
            src={assets.pufferfish} 
            alt="Pufferfish"
            className="w-32 h-32 object-contain"
          />

          {/* Bubbles effect during exhale */}
          {breathPhase === 'exhale' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <img 
                src={assets.bubbles} 
                alt="Bubbles"
                className="w-16 animate-rise"
              />
            </div>
          )}
        </div>
      </div>

      {/* Breathing instruction */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div className="bg-white/80 mx-auto max-w-sm px-4 py-2 rounded-full">
          <p className="text-lg font-medium text-blue-800">{instruction}</p>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <p className="text-lg font-medium">Loading ocean scene...</p>
        </div>
      )}
    </div>
  );
};

export default PufferfishScene3D;