import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Cloud, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { setupBreathDetection } from '@/utils/breathDetection';
import { useToast } from '@/hooks/use-toast';
import { ErrorBoundary } from 'react-error-boundary';

interface BalloonScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Mountain({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[2, 4, 4]} />
      <meshStandardMaterial 
        color="#a78bfa" 
        roughness={0.2}
        metalness={0.1}
        emissive="#4c1d95"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function Balloon({ scale, position, color }: { scale: number; position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
      <group position={position}>
        <mesh scale={[scale, scale * 1.2, scale]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            roughness={0.1} 
            metalness={0.3}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0, -1.2 * scale, 0]} scale={[0.2 * scale, 0.3 * scale, 0.2 * scale]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial 
            color="#fef3c7" 
            roughness={0.2} 
            metalness={0.3}
            emissive="#fef3c7"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0, -2 * scale, 0]} scale={[0.05 * scale, 1.5 * scale, 0.05 * scale]}>
          <cylinderGeometry />
          <meshStandardMaterial 
            color="#fef3c7" 
            roughness={0.3} 
            metalness={0.2}
            emissive="#fef3c7"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center p-4">
        <h2 className="text-lg font-semibold text-red-600">Something went wrong:</h2>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    </div>
  );
}

const Scene = ({ balloonState, breathPhase }: { balloonState: any, breathPhase: string }) => {
  return (
    <>
      <color attach="background" args={['#bae6fd']} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fef3c7" />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#e0f2fe" />
      
      <Balloon 
        scale={balloonState.scale} 
        position={[0, balloonState.yPos, 0]} 
        color={balloonState.color}
      />
      
      <Mountain position={[-4, -3, -2]} />
      <Mountain position={[4, -2, -3]} />
      <Mountain position={[0, -4, -4]} />
      
      {Array.from({ length: 12 }).map((_, i) => (
        <Cloud
          key={i}
          position={[
            (i - 6) * 4,
            Math.sin(i) * 2 + 3,
            -5 + Math.cos(i) * 2
          ]}
          opacity={0.6}
          speed={0.2}
          segments={8}
          color="#f0f9ff"
        />
      ))}

      <Stars 
        radius={50}
        depth={50}
        count={1000}
        factor={4}
        saturation={1}
        fade
        speed={0.5}
      />

      <Environment preset="sunset" />
      
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={3}
          height={480}
        />
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          kernelSize={3}
        />
        <ChromaticAberration
          offset={new Vector2(0.002, 0.002)}
        />
      </EffectComposer>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
};

const BalloonScene3D = ({ breathPhase }: BalloonScene3DProps) => {
  const [balloonState, setBalloonState] = useState({
    scale: 1,
    yPos: 0,
    color: '#f472b6'
  });
  const { toast } = useToast();
  const cleanupRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    const initBreathDetection = async () => {
      try {
        const cleanup = await setupBreathDetection(
          (volume) => {
            setBalloonState(prev => ({
              ...prev,
              scale: Math.min(1.5, 1 + (volume / 128)),
              yPos: Math.min(5, prev.yPos + (volume / 64)),
              color: '#f472b6'
            }));
          },
          (volume) => {
            setBalloonState(prev => ({
              ...prev,
              scale: Math.max(0.8, 1 - (volume / 128)),
              yPos: Math.max(-2, prev.yPos - (volume / 64)),
              color: '#fb7185'
            }));
          }
        );
        cleanupRef.current = cleanup;
      } catch (error) {
        console.error('Breath detection error:', error);
        toast({
          title: "Microphone Access Required",
          description: "Please enable microphone access to control the balloon with your breath.",
          variant: "destructive"
        });
      }
    };

    initBreathDetection();
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [toast]);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden relative">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ antialias: true }}
        >
          <Scene balloonState={balloonState} breathPhase={breathPhase} />
        </Canvas>
      </ErrorBoundary>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-lg px-6 py-2 rounded-full shadow-lg">
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