import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CarPhysicsProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  onUpdate?: (position: THREE.Vector3, rotation: THREE.Euler) => void;
}

export const CarPhysics = ({ position, rotation, scale = 1, onUpdate }: CarPhysicsProps) => {
  const meshRef = useRef<THREE.Group>();
  const velocityRef = useRef(new THREE.Vector3());
  const angularVelocityRef = useRef(0);
  const driftFactorRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Get keyboard input
    const keys = state.controls as any;
    const forward = keys?.forward || false;
    const backward = keys?.backward || false;
    const left = keys?.left || false;
    const right = keys?.right || false;
    const drift = keys?.drift || false;

    // Update physics
    const acceleration = 20;
    const deceleration = 0.95;
    const turnSpeed = 2.5;
    const maxSpeed = 30;
    const driftDecay = 0.98;

    // Handle acceleration
    if (forward) {
      velocityRef.current.z -= acceleration * delta;
    } else if (backward) {
      velocityRef.current.z += acceleration * delta;
    }
    velocityRef.current.z *= deceleration;

    // Clamp speed
    const currentSpeed = velocityRef.current.length();
    if (currentSpeed > maxSpeed) {
      velocityRef.current.multiplyScalar(maxSpeed / currentSpeed);
    }

    // Handle turning
    if (left) angularVelocityRef.current -= turnSpeed * delta;
    if (right) angularVelocityRef.current += turnSpeed * delta;
    
    // Handle drifting
    if (drift && currentSpeed > 5) {
      driftFactorRef.current = Math.min(driftFactorRef.current + delta * 2, 1);
    } else {
      driftFactorRef.current *= driftDecay;
    }

    // Apply drift effect
    const driftForce = new THREE.Vector3(
      -Math.sin(meshRef.current.rotation.y) * currentSpeed * driftFactorRef.current,
      0,
      -Math.cos(meshRef.current.rotation.y) * currentSpeed * driftFactorRef.current
    );
    velocityRef.current.add(driftForce);

    // Update position and rotation
    meshRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));
    meshRef.current.rotation.y += angularVelocityRef.current * delta;

    // Apply natural decay to angular velocity
    angularVelocityRef.current *= 0.95;

    // Notify parent of updates
    if (onUpdate) {
      onUpdate(meshRef.current.position, meshRef.current.rotation);
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1, 4]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.6}
          roughness={0.4}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
};