import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

export const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  return (
    <div className="w-full aspect-video bg-black/5 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              color={breathPhase === 'inhale' ? '#4CAF50' : '#2196F3'} 
              wireframe={breathPhase === 'hold'} 
            />
          </mesh>
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};