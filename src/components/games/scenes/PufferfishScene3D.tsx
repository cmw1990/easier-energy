import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePufferfishAssets } from '../PufferfishAssets';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

type ObstacleType = 'coral' | 'predator';

interface Obstacle {
  x: number;
  type: ObstacleType;
}

const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  const { assets } = usePufferfishAssets();
  const [pufferPosition, setPufferPosition] = useState({ y: 50 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Handle pufferfish movement based on breath
  useEffect(() => {
    if (breathPhase === 'inhale') {
      setPufferPosition(prev => ({ y: Math.min(prev.y + 10, 80) }));
    } else if (breathPhase === 'exhale') {
      setPufferPosition(prev => ({ y: Math.max(prev.y - 10, 20) }));
    }
  }, [breathPhase]);

  // Spawn obstacles
  useEffect(() => {
    if (isGameOver) return;

    const spawnInterval = setInterval(() => {
      setObstacles(prev => {
        // Remove obstacles that are off screen
        const filtered = prev.filter(obs => obs.x > -10);
        
        // Add new obstacle
        const newObstacle: Obstacle = {
          x: 100,
          type: Math.random() > 0.5 ? 'coral' : 'predator'
        };

        return [...filtered, newObstacle];
      });
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [isGameOver]);

  // Move obstacles and check collisions
  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      setObstacles(prev => {
        const moved = prev.map(obs => ({
          ...obs,
          x: obs.x - 2
        }));

        // Check collisions
        const collision = moved.some(obs => {
          const obsRect = {
            x: obs.x,
            y: obs.type === 'coral' ? 20 : 60,
            width: 40,
            height: 40
          };

          const pufferRect = {
            x: 20,
            y: pufferPosition.y,
            width: 40,
            height: 40
          };

          return (
            pufferRect.x < obsRect.x + obsRect.width &&
            pufferRect.x + pufferRect.width > obsRect.x &&
            pufferRect.y < obsRect.y + obsRect.height &&
            pufferRect.y + pufferRect.height > obsRect.y
          );
        });

        if (collision) {
          setIsGameOver(true);
        }

        return moved;
      });

      setScore(prev => prev + 1);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [isGameOver, pufferPosition.y]);

  return (
    <div 
      className="relative w-full h-[600px] bg-cover bg-center rounded-lg overflow-hidden"
      style={{ backgroundImage: `url(${assets.background})` }}
    >
      {/* Score */}
      <div className="absolute top-4 right-4 text-white text-2xl font-bold">
        Score: {score}
      </div>

      {/* Game Over */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl">Final Score: {score}</p>
          </div>
        </div>
      )}

      {/* Pufferfish */}
      <div
        className={cn(
          "absolute w-20 h-20 transition-all duration-300",
          breathPhase === 'inhale' && "scale-125",
          breathPhase === 'hold' && "scale-110",
          breathPhase === 'exhale' && "scale-100"
        )}
        style={{
          left: '20px',
          top: `${pufferPosition.y}%`,
          transform: `translateY(-50%) scale(${breathPhase === 'inhale' ? 1.25 : 1})`
        }}
      >
        <img
          src={assets.pufferfish}
          alt="Pufferfish"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Obstacles */}
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          className="absolute w-20 h-20"
          style={{
            left: `${obstacle.x}%`,
            top: obstacle.type === 'coral' ? '80%' : '20%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <img
            src={obstacle.type === 'coral' ? assets.coral : assets.predator}
            alt={obstacle.type}
            className="w-full h-full object-contain"
          />
        </div>
      ))}

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