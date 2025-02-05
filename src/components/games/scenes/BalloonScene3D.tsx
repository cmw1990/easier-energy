import React from 'react';
import { useBalloonAssets } from '../BalloonAssets';

interface BalloonProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

export const BalloonScene3D: React.FC<BalloonProps> = ({ breathPhase }) => {
  const { assets } = useBalloonAssets();

  // Get scale and color based on breath phase
  const getScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.3;
      case 'exhale': return 1.0;
      default: return 1.2;
    }
  };

  return (
    <div 
      className="w-full aspect-video bg-cover bg-center rounded-lg overflow-hidden relative"
      style={{ backgroundImage: `url(${assets.background})` }}
    >
      <img 
        src={assets.balloon}
        alt="Hot Air Balloon"
        className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-in-out w-32 h-32 object-contain"
        style={{
          transform: `translate(-50%, ${breathPhase === 'inhale' ? '-60%' : '-40%'}) scale(${getScale()})`,
        }}
      />
    </div>
  );
};