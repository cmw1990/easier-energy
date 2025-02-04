import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, ChromaticAberration, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { useGameAssets } from '@/hooks/use-game-assets';

interface PufferfishProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

const Scene = ({ breathPhase }: PufferfishProps) => {
  const { scene } = useThree();
  const pufferfishRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color(0x87CEEB);
    }
  }, [scene]);

  useFrame(() => {
    if (pufferfishRef.current) {
      if (breathPhase === 'inhale') {
        setScale(prev => Math.min(prev + 0.01, 1.5));
      } else if (breathPhase === 'exhale') {
        setScale(prev => Math.max(prev - 0.01, 1));
      }
      pufferfishRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh ref={pufferfishRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#FF9F55" />
      </mesh>
      <EffectComposer>
        <ChromaticAberration
          offset={new Vector2(0.002, 0.002)}
          radialModulation={false}
          modulationOffset={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
};

export const PufferfishScene3D = ({ breathPhase }: PufferfishProps) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <Scene breathPhase={breathPhase} />
      </Canvas>
    </div>
  );
};