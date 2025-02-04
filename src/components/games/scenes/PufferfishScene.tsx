import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls } from '@react-three/drei';
import { Pufferfish } from '../models/Pufferfish';

export const PufferfishScene = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas
        shadows
        camera={{ 
          position: [0, 0, 5], 
          fov: 75 
        }}
        gl={{ 
          antialias: true,
          alpha: true
        }}
      >
        <color attach="background" args={['#f0f0f0']} />
        <Suspense fallback={null}>
          <Stage
            preset="rembrandt"
            intensity={0.5}
            environment="sunset"
          >
            <Pufferfish />
          </Stage>
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};