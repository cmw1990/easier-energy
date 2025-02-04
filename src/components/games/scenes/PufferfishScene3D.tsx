import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, ChromaticAberration, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { Vector2 } from 'three';

interface SceneProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

const Scene = ({ breathPhase }: SceneProps) => {
  const pufferfishRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (breathPhase === 'inhale') {
      setScale(1.5);
    } else if (breathPhase === 'exhale') {
      setScale(1);
    }
  }, [breathPhase]);

  useFrame(() => {
    if (pufferfishRef.current) {
      pufferfishRef.current.scale.setScalar(THREE.MathUtils.lerp(
        pufferfishRef.current.scale.x,
        scale,
        0.1
      ));
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh ref={pufferfishRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#FF9F55" />
      </mesh>
    </>
  );
};

export const PufferfishScene3D = ({ breathPhase }: SceneProps) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <Scene breathPhase={breathPhase} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <EffectComposer>
          <ChromaticAberration
            offset={new Vector2(0.002, 0.002)}
            blendFunction={BlendFunction.NORMAL}
          />
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};