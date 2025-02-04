import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

function Pufferfish({ breathPhase }: { breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Physics-based movement based on breath phase
    switch (breathPhase) {
      case 'inhale':
        setScale(prev => THREE.MathUtils.lerp(prev, 1.5, delta * 2));
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          2,
          delta * 0.5
        );
        break;
      case 'exhale':
        setScale(prev => THREE.MathUtils.lerp(prev, 0.8, delta * 2));
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          -1,
          delta * 0.5
        );
        break;
      case 'hold':
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * delta * 0.1;
        break;
      case 'rest':
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          -1,
          delta * 0.3
        );
        break;
    }

    // Gentle swimming motion
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
  });

  return (
    <RigidBody type="dynamic" colliders="ball">
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh
          ref={meshRef}
          scale={[scale, scale, scale]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial
            color={hovered ? "#ffa502" : "#ff9f43"}
            speed={2}
            distort={0.4}
            radius={1}
          />
        </mesh>
      </Float>
    </RigidBody>
  );
}

function Bubbles() {
  const count = 50;
  const positions = useRef(
    Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * -10,
        (Math.random() - 0.5) * 10
      ],
      speed: 0.2 + Math.random() * 0.5
    }))
  );

  useFrame((state, delta) => {
    positions.current.forEach(bubble => {
      bubble.position[1] += bubble.speed * delta;
      if (bubble.position[1] > 10) bubble.position[1] = -10;
    });
  });

  return (
    <group>
      {positions.current.map((bubble, i) => (
        <RigidBody key={i} type="dynamic" colliders="ball" position={bubble.position as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <MeshDistortMaterial
              transparent
              opacity={0.6}
              color="#ffffff"
              speed={1}
              distort={0.2}
            />
          </mesh>
        </RigidBody>
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
      <Physics gravity={[0, -1, 0]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Pufferfish breathPhase={breathPhase} />
        <Bubbles />
        <CuboidCollider args={[20, 1, 20]} position={[0, -10, 0]} />
      </Physics>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="sunset" />
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Bloom luminanceThreshold={0.5} intensity={2} />
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
  );
}
