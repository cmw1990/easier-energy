import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';

interface BalloonScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

function Balloon({ scale, position }: { scale: number; position: [number, number, number] }) {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        {/* Balloon body */}
        <mesh scale={[scale, scale * 1.2, scale]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#ff4757" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Balloon tie */}
        <mesh position={[0, -1.2 * scale, 0]} scale={[0.2 * scale, 0.3 * scale, 0.2 * scale]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#c0392b" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* String */}
        <mesh position={[0, -2 * scale, 0]} scale={[0.05 * scale, 1.5 * scale, 0.05 * scale]}>
          <cylinderGeometry />
          <meshStandardMaterial color="#ecf0f1" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

const BalloonScene3D = ({ breathPhase }: BalloonScene3DProps) => {
  const scale = breathPhase === 'inhale' ? 1.5 : 1;
  const yPos = breathPhase === 'inhale' ? 2 : 0;
  
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden relative bg-sky-100">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Balloon scale={scale} position={[0, yPos, 0]} />
        
        {/* Add some clouds */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Cloud
            key={i}
            position={[
              (i - 4) * 4,
              Math.sin(i) * 2 + 3,
              -5 + Math.cos(i) * 2
            ]}
            opacity={0.5}
            speed={0.1}
            segments={8}
          />
        ))}

        <Environment preset="sunset" />
        <EffectComposer>
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />
          <Bloom luminanceThreshold={0.5} intensity={1.5} />
        </EffectComposer>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>
      
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

export default BalloonScene3D;