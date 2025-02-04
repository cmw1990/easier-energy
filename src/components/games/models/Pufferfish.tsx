import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { usePufferfish } from '../contexts/PufferfishContext';

export const Pufferfish = () => {
  const meshRef = useRef<Mesh>(null);
  const { breathPhase } = usePufferfish();
  
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = breathPhase === 'inhale' ? 1.5 : 1;
      meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color="orange"
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  );
};