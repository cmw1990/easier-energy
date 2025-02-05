import React from 'react';

interface BalloonProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

export const BalloonScene3D: React.FC<BalloonProps> = ({ breathPhase }) => {
  // Get scale and color based on breath phase
  const getScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.3;
      case 'exhale': return 1.0;
      default: return 1.2;
    }
  };

  const getColor = () => {
    switch (breathPhase) {
      case 'inhale': return '#FF9999';
      case 'hold': return '#FFB6C1';
      case 'exhale': return '#FFC0CB';
      default: return '#FFE4E1';
    }
  };

  return (
    <div className="w-full aspect-video bg-black/5 rounded-lg overflow-hidden flex items-center justify-center">
      <div 
        className="w-32 h-32 rounded-full transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: getColor(),
          transform: `scale(${getScale()}) translateY(${breathPhase === 'inhale' ? '-20px' : '0'})`,
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
};