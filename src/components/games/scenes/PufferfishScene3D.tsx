import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { OrbitControls } from "@react-three/drei";

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
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
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <OrbitControls enableZoom={false} />
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
      </Suspense>
    </Canvas>
  );
};