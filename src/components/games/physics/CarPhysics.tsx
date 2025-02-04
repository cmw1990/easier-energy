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
  const trailsRef = useRef<THREE.Points>();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Get keyboard input
    const keys = state.controls as any;
    const forward = keys?.forward || false;
    const backward = keys?.backward || false;
    const left = keys?.left || false;
    const right = keys?.right || false;
    const drift = keys?.drift || false;

    // Update physics with dreamy values
    const acceleration = 15; // Reduced for smoother acceleration
    const deceleration = 0.98; // Increased for more floating feeling
    const turnSpeed = 2.0; // Reduced for smoother turning
    const maxSpeed = 25; // Reduced for better control
    const driftDecay = 0.99; // Increased for longer drifts
    const lateralFriction = drift ? 0.95 : 0.8; // More slide when drifting

    // Handle acceleration with smooth ramping
    if (forward) {
      velocityRef.current.z -= acceleration * delta * (1 - Math.abs(driftFactorRef.current) * 0.3);
    } else if (backward) {
      velocityRef.current.z += acceleration * delta * (1 - Math.abs(driftFactorRef.current) * 0.3);
    }
    
    // Apply natural deceleration
    velocityRef.current.z *= deceleration;
    velocityRef.current.x *= lateralFriction;

    // Clamp speed with smooth transition
    const currentSpeed = velocityRef.current.length();
    if (currentSpeed > maxSpeed) {
      const scale = maxSpeed / currentSpeed;
      velocityRef.current.multiplyScalar(scale);
    }

    // Handle turning with drift influence
    if (left) {
      angularVelocityRef.current -= turnSpeed * delta * (1 + driftFactorRef.current * 0.5);
    }
    if (right) {
      angularVelocityRef.current += turnSpeed * delta * (1 + driftFactorRef.current * 0.5);
    }
    
    // Enhanced drift mechanics
    if (drift && currentSpeed > 5) {
      driftFactorRef.current = Math.min(driftFactorRef.current + delta * 1.5, 1);
      
      // Add lateral force during drift
      const driftForce = new THREE.Vector3(
        -Math.sin(meshRef.current.rotation.y) * currentSpeed * driftFactorRef.current * 0.8,
        0,
        -Math.cos(meshRef.current.rotation.y) * currentSpeed * driftFactorRef.current * 0.3
      );
      velocityRef.current.add(driftForce);
    } else {
      driftFactorRef.current *= driftDecay;
    }

    // Update position and rotation with smooth interpolation
    meshRef.current.position.add(
      velocityRef.current
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), meshRef.current.rotation.y)
        .multiplyScalar(delta)
    );
    
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
          emissive="#ffffff"
          emissiveIntensity={driftFactorRef.current * 0.2}
        />
      </mesh>
      
      {/* Ethereal trail effect */}
      <points ref={trailsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1}
            array={new Float32Array(3)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
};