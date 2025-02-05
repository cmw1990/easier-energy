import { useEffect, useRef } from 'react';
import { usePufferfishAssets } from '../PufferfishAssets';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { assets } = usePufferfishAssets();
  
  // Load images
  const pufferfishImage = new Image();
  const bubblesImage = new Image();
  const seaweedImage = new Image();
  const coralImage = new Image();
  const backgroundImage = new Image();

  pufferfishImage.src = assets.pufferfish;
  bubblesImage.src = assets.bubbles;
  seaweedImage.src = assets.seaweed;
  coralImage.src = assets.coral;
  backgroundImage.src = assets.background;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let bubblePositions: { x: number; y: number }[] = Array(5).fill(null).map(() => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 50
    }));

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Draw coral
      ctx.drawImage(coralImage, 0, canvas.height - 100, canvas.width, 100);

      // Draw seaweed
      for (let i = 0; i < 3; i++) {
        ctx.drawImage(
          seaweedImage,
          i * 100,
          canvas.height - 150,
          50,
          150
        );
      }

      // Draw pufferfish
      const pufferfishSize = breathPhase === 'inhale' ? 120 : 
                            breathPhase === 'hold' ? 110 : 100;
      
      ctx.drawImage(
        pufferfishImage,
        canvas.width / 2 - pufferfishSize / 2,
        canvas.height / 2 - pufferfishSize / 2,
        pufferfishSize,
        pufferfishSize
      );

      // Draw bubbles during exhale
      if (breathPhase === 'exhale') {
        bubblePositions.forEach((bubble, i) => {
          ctx.drawImage(bubblesImage, bubble.x, bubble.y, 20, 20);
          bubble.y -= 2;
          if (bubble.y < -20) {
            bubble.y = canvas.height + 20;
            bubble.x = Math.random() * canvas.width;
          }
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [breathPhase, assets]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
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