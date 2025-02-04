import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Cloud, Float } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, GodRays } from '@react-three/postprocessing';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

function Balloon({ breathPhase }: { breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Physics-based movement based on breath phase
    switch (breathPhase) {
      case 'inhale':
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          2,
          delta
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1.2,
          delta
        );
        break;
      case 'exhale':
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          -1,
          delta * 0.5
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1,
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
          delta * 0.3
        );
        break;
    }

    // Gentle swaying
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <RigidBody type="dynamic" colliders="hull" linearDamping={0.95} angularDamping={0.95}>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
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
    </RigidBody>
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
  const sunRef = useRef<THREE.Mesh>(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      style={{
        width: '100%',
        height: '400px',
        background: 'linear-gradient(to bottom, #48dbfb, #c8d6e5)'
      }}
    >
      <Physics gravity={[0, -2, 0]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <mesh ref={sunRef} position={[0, 10, -10]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
        <Balloon breathPhase={breathPhase} />
        <SkyEnvironment />
        <CuboidCollider args={[20, 1, 20]} position={[0, -10, 0]} />
      </Physics>
      <Environment preset="sunset" />
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Bloom luminanceThreshold={0.5} intensity={1.5} />
        <GodRays
          sun={sunRef}
          blendFunction={0}
          samples={60}
          density={0.96}
          decay={0.9}
          weight={0.4}
          exposure={0.6}
          clampMax={1}
          width={Bloom.DEFAULT_RESOLUTION}
          height={Bloom.DEFAULT_RESOLUTION}
          kernelSize={KernelSize.SMALL}
          blur={true}
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