import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Pufferfish({ breathPhase }: { breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Animate based on breath phase
    switch (breathPhase) {
      case 'inhale':
        setScale(prev => Math.min(prev + delta * 0.5, 1.5));
        break;
      case 'exhale':
        setScale(prev => Math.max(prev - delta * 0.5, 0.8));
        break;
      case 'hold':
        // Gentle floating motion during hold
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        break;
      case 'rest':
        // Gentle sinking motion during rest
        meshRef.current.position.y = Math.max(
          meshRef.current.position.y - delta * 0.1,
          -0.5
        );
        break;
    }

    // Add gentle rotation
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#ff9f43"
        roughness={0.5}
        metalness={0.2}
      />
    </mesh>
  );
}

function Bubbles() {
  const particles = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const pos = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (!particles.current) return;
    
    const positions = particles.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += delta * 0.5; // Move up
      if (positions[i + 1] > 5) {
        positions[i + 1] = -5; // Reset to bottom
      }
    }
    particles.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function PufferfishScene3D({ 
  breathPhase 
}: { 
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' 
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ 
        width: '100%', 
        height: '400px',
        background: 'linear-gradient(to bottom, #1a5f7a, #2d3436)'
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Pufferfish breathPhase={breathPhase} />
      <Bubbles />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}