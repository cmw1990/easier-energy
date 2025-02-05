import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface PufferfishProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Scene({ breathPhase }: PufferfishProps) {
  const scale = breathPhase === 'inhale' ? 1.5 : 1;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh scale={[scale, scale, scale]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={breathPhase === 'inhale' ? '#4CAF50' : '#2196F3'} 
          wireframe={breathPhase === 'hold'} 
        />
      </mesh>
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}

const PufferfishScene3D: React.FC<PufferfishProps> = ({ breathPhase }) => {
  return (
    <div className="w-full aspect-video bg-black/5 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        gl={{ antialias: true }}
      >
        <Scene breathPhase={breathPhase} />
      </Canvas>
    </div>
  );
};

export default PufferfishScene3D;