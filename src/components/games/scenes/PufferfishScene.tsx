import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls } from '@react-three/drei';
import { Pufferfish } from '../models/Pufferfish';

export const PufferfishScene = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <Stage
            environment="sunset"
            intensity={0.5}
            shadows={{ type: 'contact', opacity: 0.3, blur: 2 }}
            preset="rembrandt"
          >
            <Pufferfish />
          </Stage>
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};