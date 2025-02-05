import React from 'react';

interface PufferfishProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

const PufferfishScene3D: React.FC<PufferfishProps> = ({ breathPhase }) => {
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
      case 'inhale': return '#4CAF50';
      case 'hold': return '#2196F3';
      case 'exhale': return '#FFC107';
      default: return '#9C27B0';
    }
  };

  return (
    <div className="w-full aspect-video bg-black/5 rounded-lg overflow-hidden flex items-center justify-center">
      <div 
        className="w-32 h-32 rounded-full transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: getColor(),
          transform: `scale(${getScale()})`,
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
};

export default PufferfishScene3D;