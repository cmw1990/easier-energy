import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { setupBreathDetection } from '@/utils/breathDetection';
import { useToast } from '@/hooks/use-toast';

interface BalloonScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Mountain({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[2, 4, 4]} />
      <meshStandardMaterial color="#718096" roughness={0.7} />
    </mesh>
  );
}

function Balloon({ scale, position, color }: { scale: number; position: [number, number, number]; color: string }) {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh scale={[scale, scale * 1.2, scale]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, -1.2 * scale, 0]} scale={[0.2 * scale, 0.3 * scale, 0.2 * scale]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#c0392b" roughness={0.5} metalness={0.1} />
        </mesh>
        <mesh position={[0, -2 * scale, 0]} scale={[0.05 * scale, 1.5 * scale, 0.05 * scale]}>
          <cylinderGeometry />
          <meshStandardMaterial color="#ecf0f1" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

const BalloonScene3D = ({ breathPhase }: BalloonScene3DProps) => {
  const [balloonState, setBalloonState] = useState({
    scale: 1,
    yPos: 0,
    color: '#ff6b6b'
  });
  const { toast } = useToast();
  
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initBreathDetection = async () => {
      try {
        cleanup = await setupBreathDetection(
          (volume) => {
            setBalloonState(prev => ({
              ...prev,
              scale: Math.min(1.5, 1 + (volume / 128)),
              yPos: Math.min(5, prev.yPos + (volume / 64)),
              color: '#ff6b6b'
            }));
          },
          (volume) => {
            setBalloonState(prev => ({
              ...prev,
              scale: Math.max(0.8, 1 - (volume / 128)),
              yPos: Math.max(-2, prev.yPos - (volume / 64)),
              color: '#ff8787'
            }));
          }
        );
      } catch (error) {
        toast({
          title: "Microphone Access Required",
          description: "Please enable microphone access to control the balloon with your breath.",
          variant: "destructive"
        });
      }
    };

    initBreathDetection();
    return () => cleanup?.();
  }, [toast]);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#a8d5e5']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Balloon 
          scale={balloonState.scale} 
          position={[0, balloonState.yPos, 0]} 
          color={balloonState.color}
        />
        
        {/* Add mountains as obstacles */}
        <Mountain position={[-4, -3, -2]} />
        <Mountain position={[4, -2, -3]} />
        
        {/* Add clouds */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Cloud
            key={i}
            position={[
              (i - 4) * 4,
              Math.sin(i) * 2 + 3,
              -5 + Math.cos(i) * 2
            ]}
            opacity={0.5}
            speed={0.1}
            segments={8}
          />
        ))}

        <Environment preset="sunset" />
        <EffectComposer>
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
      
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

export default BalloonScene3D;