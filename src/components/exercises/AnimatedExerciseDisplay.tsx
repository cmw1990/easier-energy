import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface AnimatedExerciseDisplayProps {
  imageUrl: string;
  exerciseType: string;
  animationType?: 'css' | 'svg' | '3d';
}

const ExerciseScene = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <mesh>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial>
        <primitive attach="map" object={new THREE.TextureLoader().load(imageUrl)} />
      </meshBasicMaterial>
    </mesh>
  );
};

const SVGAnimation = ({ exerciseType }: { exerciseType: string }) => {
  const getAnimationPath = () => {
    switch (exerciseType) {
      case 'stretch':
        return "M10 10 Q 50 0, 90 10 T 170 10";
      case 'cardio':
        return "M10 50 L 90 10 L 170 50";
      default:
        return "M10 50 L 90 50 L 170 50";
    }
  };

  return (
    <svg className="w-full h-full" viewBox="0 0 180 100">
      <path
        d={getAnimationPath()}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="animate-exercise-pulse"
      />
    </svg>
  );
};

export const AnimatedExerciseDisplay = ({
  imageUrl,
  exerciseType,
  animationType = 'css'
}: AnimatedExerciseDisplayProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getAnimationClass = () => {
    switch (exerciseType) {
      case 'stretch':
        return 'animate-exercise-stretch';
      case 'cardio':
        return 'animate-exercise-bounce';
      case 'strength':
        return 'animate-exercise-pulse';
      default:
        return 'animate-exercise-rotate';
    }
  };

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
      {animationType === 'css' && (
        <img
          src={imageUrl}
          alt={`${exerciseType} exercise`}
          className={`w-full h-full object-contain ${getAnimationClass()}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {animationType === 'svg' && (
        <div className="relative w-full h-full">
          <SVGAnimation exerciseType={exerciseType} />
          <img
            src={imageUrl}
            alt={`${exerciseType} exercise`}
            className="absolute inset-0 w-full h-full object-contain mix-blend-multiply"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      )}

      {animationType === '3d' && (
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ExerciseScene imageUrl={imageUrl} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      )}

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};