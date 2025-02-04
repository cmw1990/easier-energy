import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Stars, Cloud, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function Balloon({ breathPhase }: { breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Balloon physics based on breath phase
    switch (breathPhase) {
      case 'inhale':
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          2,
          delta * 2
        );
        meshRef.current.scale.x = THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          1.2,
          delta * 2
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1.5,
          delta * 2
        );
        break;
      case 'exhale':
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          -2,
          delta * 1.5
        );
        meshRef.current.scale.x = THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          0.8,
          delta * 2
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1,
          delta * 2
        );
        break;
      case 'hold':
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * delta * 0.1;
        break;
      case 'rest':
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          -2,
          delta * 0.5
        );
        break;
    }

    // Gentle swaying
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? "#ff6b6b" : "#ff4757"}
          roughness={0.3}
          metalness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function SkyEnvironment() {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      {Array.from({ length: 20 }).map((_, i) => (
        <Cloud
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
          ]}
          opacity={0.5}
          speed={0.1}
          width={10}
        />
      ))}
    </>
  );
}

export function BalloonScene3D({
  breathPhase
}: {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest'
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      style={{
        width: '100%',
        height: '400px',
        background: 'linear-gradient(to bottom, #48dbfb, #c8d6e5)'
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Balloon breathPhase={breathPhase} />
      <SkyEnvironment />
      <Environment preset="sunset" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} intensity={1.5} />
      </EffectComposer>
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
    </Canvas>
  );
}