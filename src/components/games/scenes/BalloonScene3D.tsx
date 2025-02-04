import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import * as THREE from 'three';

interface BalloonScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

export const BalloonScene3D = ({ breathPhase }: BalloonScene3DProps) => {
  const [scale, setScale] = useState(1);
  
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[2, 2, 2]}
          intensity={1}
          shadow-mapSize={[1024, 1024]}
        />
        
        <mesh
          scale={scale}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#FF9999"
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>

        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2, 0]}
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial 
            color="#88CCFF"
            transparent
            opacity={0.3}
          />
        </mesh>

        <Environment preset="sunset" />
        
        <EffectComposer>
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.025}
            blendFunction={BlendFunction.ADD}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.002, 0.002)}
            radialModulation={false}
            modulationOffset={0.5}
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};