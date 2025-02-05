import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface PufferfishProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Scene({ breathPhase }: PufferfishProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Scale based on breath phase
  const scale = breathPhase === 'inhale' ? 1.5 : 
                breathPhase === 'hold' ? 1.3 :
                breathPhase === 'exhale' ? 1.0 : 1.2;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh
        ref={meshRef}
        scale={scale}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={breathPhase === 'inhale' ? '#4CAF50' : 
                breathPhase === 'hold' ? '#2196F3' : 
                breathPhase === 'exhale' ? '#FFC107' : '#9C27B0'} 
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