import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Balloon({ breathPhase }: { breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    switch (breathPhase) {
      case 'inhale':
        meshRef.current.position.y = Math.min(
          meshRef.current.position.y + delta * 2,
          2
        );
        meshRef.current.scale.x = Math.min(meshRef.current.scale.x + delta * 0.2, 1.2);
        meshRef.current.scale.y = Math.min(meshRef.current.scale.y + delta * 0.3, 1.5);
        break;
      case 'exhale':
        meshRef.current.position.y = Math.max(
          meshRef.current.position.y - delta * 1.5,
          -2
        );
        meshRef.current.scale.x = Math.max(meshRef.current.scale.x - delta * 0.2, 0.8);
        meshRef.current.scale.y = Math.max(meshRef.current.scale.y - delta * 0.3, 1);
        break;
      case 'hold':
        // Gentle floating
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * delta * 0.1;
        break;
      case 'rest':
        // Gentle descent
        meshRef.current.position.y = Math.max(
          meshRef.current.position.y - delta * 0.5,
          -2
        );
        break;
    }

    // Add gentle swaying
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshStandardMaterial
        color="#ff4757"
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

function Clouds() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5 + 2,
            (Math.random() - 0.5) * 10
          ]}
        >
          <sphereGeometry args={[0.3 + Math.random() * 0.5, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export function BalloonScene3D({
  breathPhase
}: {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest'
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      style={{
        width: '100%',
        height: '400px',
        background: 'linear-gradient(to bottom, #48dbfb, #c8d6e5)'
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Balloon breathPhase={breathPhase} />
      <Clouds />
      <Environment preset="dawn" />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}