import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { usePufferfishAssets } from '../PufferfishAssets';
import { cn } from '@/lib/utils';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Pufferfish({ breathPhase }: { breathPhase: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { assets } = usePufferfishAssets();
  const texture = useLoader(TextureLoader, assets.pufferfish);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Target scales for different breath phases
    const targetScale = breathPhase === 'inhale' ? 1.5 : 
                       breathPhase === 'hold' ? 1.3 : 1;

    // Smooth scale transition
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 2);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, delta * 2);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, delta * 2);

    // Add gentle floating motion
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        map={texture}
        transparent
        opacity={0.9}
        roughness={0.5}
        metalness={0.2}
      />
    </mesh>
  );
}

function Bubbles({ breathPhase }: { breathPhase: string }) {
  const { assets } = usePufferfishAssets();
  const texture = useLoader(TextureLoader, assets.bubbles);
  const bubblesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!bubblesRef.current || breathPhase !== 'exhale') return;
    bubblesRef.current.children.forEach((bubble, i) => {
      bubble.position.y += 0.02;
      bubble.position.x += Math.sin(state.clock.elapsedTime + i) * 0.01;
      if (bubble.position.y > 3) bubble.position.y = -1;
    });
  });

  if (breathPhase !== 'exhale') return null;

  return (
    <group ref={bubblesRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.random() * 2 - 1, -1 + i * 0.5, Math.random() * 2 - 1]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshStandardMaterial map={texture} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Seaweed() {
  const { assets } = usePufferfishAssets();
  const texture = useLoader(TextureLoader, assets.seaweed);
  const seaweedRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!seaweedRef.current) return;
    seaweedRef.current.children.forEach((plant, i) => {
      plant.rotation.z = Math.sin(state.clock.elapsedTime + i) * 0.1;
    });
  });

  return (
    <group ref={seaweedRef} position={[0, -2, 0]}>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[i * 1 - 1, 0, 0]}>
          <planeGeometry args={[0.5, 1]} />
          <meshStandardMaterial map={texture} transparent />
        </mesh>
      ))}
    </group>
  );
}

function Coral() {
  const { assets } = usePufferfishAssets();
  const texture = useLoader(TextureLoader, assets.coral);

  return (
    <mesh position={[0, -2, -1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 5]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  );
}

const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  const { assets } = usePufferfishAssets();

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        
        <Pufferfish breathPhase={breathPhase} />
        <Bubbles breathPhase={breathPhase} />
        <Seaweed />
        <Coral />
        
        {/* Background */}
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial map={useLoader(TextureLoader, assets.background)} />
        </mesh>
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