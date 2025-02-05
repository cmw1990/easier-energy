import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { usePufferfishAssets } from '../PufferfishAssets';
import { motion } from 'framer-motion';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Pufferfish({ scale, position }: { scale: number; position: [number, number, number] }) {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position} scale={[scale, scale, scale]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff9f43" roughness={0.5} metalness={0.2} />
      </mesh>
    </Float>
  );
}

function Seaweed({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh position={position}>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color="#2ecc71" roughness={0.6} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function Bubbles({ count = 20 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Float 
          key={i}
          speed={2} 
          rotationIntensity={0.5} 
          floatIntensity={2}
          position={[
            (Math.random() - 0.5) * 10,
            Math.random() * 10,
            (Math.random() - 0.5) * 10
          ]}
        >
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.6} 
              roughness={0.1} 
              metalness={0.8} 
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  const { assets } = usePufferfishAssets();
  const scale = breathPhase === 'inhale' ? 1.5 : 1;
  
  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{
          background: 'linear-gradient(to bottom, #1e3799, #0c2461)'
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Pufferfish scale={scale} position={[0, 0, 0]} />
        
        {/* Add seaweed */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Seaweed 
            key={i} 
            position={[
              (i - 2) * 2,
              -3,
              Math.sin(i) * 2
            ]} 
          />
        ))}
        
        <Bubbles />

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

export default PufferfishScene3D;