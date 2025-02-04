import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Float, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';

function Pufferfish({ breathPhase }: { breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Pufferfish physics based on breath phase
    switch (breathPhase) {
      case 'inhale':
        setScale(prev => THREE.MathUtils.lerp(prev, 1.5, delta * 2));
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          2,
          delta
        );
        break;
      case 'exhale':
        setScale(prev => THREE.MathUtils.lerp(prev, 0.8, delta * 2));
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          -1,
          delta
        );
        break;
      case 'hold':
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * delta * 0.1;
        break;
      case 'rest':
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          -1,
          delta * 0.5
        );
        break;
    }

    // Gentle swimming motion
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh
        ref={meshRef}
        scale={[scale, scale, scale]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={hovered ? "#ffa502" : "#ff9f43"}
          speed={5}
          distort={0.3}
          radius={1}
        />
      </mesh>
    </Float>
  );
}

function Bubbles() {
  const groupRef = useRef<THREE.Group>(null);
  const [bubblePositions] = useState(() =>
    Array.from({ length: 50 }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * -10,
      z: (Math.random() - 0.5) * 10,
      speed: 0.2 + Math.random() * 0.5
    }))
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.children.forEach((bubble, i) => {
      bubble.position.y += bubblePositions[i].speed * delta;
      if (bubble.position.y > 10) {
        bubble.position.y = -10;
      }
      bubble.position.x += Math.sin(state.clock.elapsedTime + i) * delta * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {bubblePositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            transparent
            opacity={0.6}
            color="#ffffff"
          />
        </mesh>
      ))}
    </group>
  );
}

export function PufferfishScene3D({
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
        background: 'linear-gradient(to bottom, #1a5f7a, #2d3436)'
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Pufferfish breathPhase={breathPhase} />
      <Bubbles />
      <Environment preset="sunset" />
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Bloom luminanceThreshold={0.5} intensity={2} />
      </EffectComposer>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}