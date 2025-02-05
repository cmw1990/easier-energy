import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Pufferfish({ breathPhase }: { breathPhase: PufferfishScene3DProps['breathPhase'] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = breathPhase === 'inhale' ? 1.5 : 1;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={breathPhase === 'inhale' ? '#4CAF50' : '#2196F3'} 
        wireframe={breathPhase === 'hold'} 
      />
    </mesh>
  );
}

const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  return (
    <div className="w-full aspect-video bg-black/5 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Pufferfish breathPhase={breathPhase} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default PufferfishScene3D;