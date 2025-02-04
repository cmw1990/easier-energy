import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import {
  OrbitControls,
  Environment,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Pufferfish({ breathPhase }: { breathPhase: PufferfishScene3DProps['breathPhase'] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = breathPhase === 'inhale' ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 75,
        near: 0.1,
        far: 1000,
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Pufferfish breathPhase={breathPhase} />
        <Environment preset="sunset" />
        <OrbitControls enableZoom={false} />
      </Suspense>
    </Canvas>
  );
};