import React from 'react';
import { useBalloonAssets } from '../BalloonAssets';

interface BalloonProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

export const BalloonScene3D: React.FC<BalloonProps> = ({ breathPhase }) => {
  const { assets } = useBalloonAssets();

  const getBalloonAnimation = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'animate-float-up';
      case 'hold':
        return 'animate-sway';
      case 'exhale':
        return 'animate-float-down';
      default:
        return '';
    }
  };

  return (
    <div 
      className="w-full h-[60vh] bg-cover bg-center rounded-lg overflow-hidden relative"
      style={{ 
        backgroundImage: `url(${assets.background})`,
        backgroundSize: 'cover'
      }}
    >
      <img 
        src={assets.balloon}
        alt="Hot Air Balloon"
        className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-contain transition-all duration-1000 ease-in-out ${getBalloonAnimation()}`}
      />
    </div>
  );
};