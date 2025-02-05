import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

interface CarPhysicsProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  onUpdate?: (position: THREE.Vector3, rotation: THREE.Euler) => void;
}

export const CarPhysics = ({ position, rotation, scale = 1, onUpdate }: CarPhysicsProps) => {
  const rigidBodyRef = useRef(null);
  const velocityRef = useRef(new THREE.Vector3());
  const angularVelocityRef = useRef(0);
  const driftFactorRef = useRef(0);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    const keys = {
      forward: state.controls?.forward || false,
      backward: state.controls?.backward || false,
      left: state.controls?.left || false,
      right: state.controls?.right || false,
      drift: state.controls?.drift || false,
    };

    const acceleration = 15;
    const deceleration = 0.98;
    const turnSpeed = 2.0;
    const maxSpeed = 25;
    const driftDecay = 0.99;
    const lateralFriction = keys.drift ? 0.95 : 0.8;

    // Handle acceleration
    if (keys.forward) {
      velocityRef.current.z -= acceleration * delta * (1 - Math.abs(driftFactorRef.current) * 0.3);
    } else if (keys.backward) {
      velocityRef.current.z += acceleration * delta * (1 - Math.abs(driftFactorRef.current) * 0.3);
    }
    
    // Apply deceleration and friction
    velocityRef.current.z *= deceleration;
    velocityRef.current.x *= lateralFriction;

    // Clamp speed
    const currentSpeed = velocityRef.current.length();
    if (currentSpeed > maxSpeed) {
      velocityRef.current.multiplyScalar(maxSpeed / currentSpeed);
    }

    // Handle turning
    if (keys.left) {
      angularVelocityRef.current -= turnSpeed * delta * (1 + driftFactorRef.current * 0.5);
    }
    if (keys.right) {
      angularVelocityRef.current += turnSpeed * delta * (1 + driftFactorRef.current * 0.5);
    }
    
    // Handle drifting
    if (keys.drift && currentSpeed > 5) {
      driftFactorRef.current = Math.min(driftFactorRef.current + delta * 1.5, 1);
      const driftForce = new THREE.Vector3(
        -Math.sin(rigidBodyRef.current.rotation().y) * currentSpeed * driftFactorRef.current * 0.8,
        0,
        -Math.cos(rigidBodyRef.current.rotation().y) * currentSpeed * driftFactorRef.current * 0.3
      );
      velocityRef.current.add(driftForce);
    } else {
      driftFactorRef.current *= driftDecay;
    }

    // Update physics body
    const currentTransform = rigidBodyRef.current.translation();
    const nextPosition = new THREE.Vector3(
      currentTransform.x,
      currentTransform.y,
      currentTransform.z
    ).add(velocityRef.current.clone().multiplyScalar(delta));

    rigidBodyRef.current.setTranslation(nextPosition);
    rigidBodyRef.current.setRotation(new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, rigidBodyRef.current.rotation().y + angularVelocityRef.current * delta, 0)
    ));

    // Natural angular velocity decay
    angularVelocityRef.current *= 0.95;

    if (onUpdate) {
      onUpdate(nextPosition, new THREE.Euler(0, rigidBodyRef.current.rotation().y, 0));
    }
  });

  return (
    <RigidBody ref={rigidBodyRef} position={position} rotation={rotation} colliders={false}>
      <CuboidCollider args={[1, 0.5, 2]} />
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
    </RigidBody>
  );
};