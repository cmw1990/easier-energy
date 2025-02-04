import { PufferfishProvider } from '../contexts/PufferfishContext';
import { PufferfishScene } from './PufferfishScene';

interface PufferfishScene3DProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
}

export const PufferfishScene3D = ({ breathPhase }: PufferfishScene3DProps) => {
  return (
    <div className="w-full h-full">
      <PufferfishProvider breathPhase={breathPhase}>
        <PufferfishScene />
      </PufferfishProvider>
    </div>
  );
};