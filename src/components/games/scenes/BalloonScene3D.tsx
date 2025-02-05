import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { useBalloonAssets } from '../BalloonAssets';

interface BalloonProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function HotAirBalloon({ position, scale }: { position: [number, number, number], scale: number }) {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} scale={[scale, scale, scale]}>
        {/* Balloon */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Basket */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.2} />
        </mesh>
        {/* Ropes */}
        {[[-0.25, 0.25], [0.25, 0.25], [-0.25, -0.25], [0.25, -0.25]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.25, z]}>
            <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
            <meshStandardMaterial color="#8b4513" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export const BalloonScene3D: React.FC<BalloonProps> = ({ breathPhase }) => {
  const { assets, isLoading } = useBalloonAssets();
  const scale = breathPhase === 'inhale' ? 1.2 : 1;
  const height = breathPhase === 'inhale' ? 2 : 0;
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-[60vh] rounded-lg overflow-hidden relative bg-sky-100">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <HotAirBalloon position={[0, height, 0]} scale={scale} />
        
        {/* Add clouds */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Cloud
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              Math.random() * 10,
              (Math.random() - 0.5) * 20
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
          <Bloom luminanceThreshold={0.5} intensity={1.5} />
        </EffectComposer>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
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