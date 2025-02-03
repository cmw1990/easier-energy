import { BreathingBaseScene } from './BreathingBaseScene';

interface GameState {
  score: number;
  fishPosition: number;
  fishSize: number;
  isPlaying: boolean;
}

interface ParticlePool {
  active: Phaser.GameObjects.Particles.ParticleEmitter[];
  inactive: Phaser.GameObjects.Particles.ParticleEmitter[];
}

export class PufferfishScene extends BreathingBaseScene {
  private gameState: GameState;
  private breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
  private onScoreUpdate: (score: number) => void;
  private particlePool: ParticlePool;
  private lastFrameTime: number;
  private frameCount: number;
  private fpsUpdateInterval: number;

  constructor(onScoreUpdate: (score: number) => void) {
    super({ key: 'PufferfishScene' });
    this.gameState = {
      score: 0,
      fishPosition: 50,
      fishSize: 1,
      isPlaying: false
    };
    this.breathPhase = 'rest';
    this.onScoreUpdate = onScoreUpdate;
    this.particlePool = {
      active: [],
      inactive: []
    };
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fpsUpdateInterval = 1000;
  }

  setBreathPhase(phase: 'inhale' | 'hold' | 'exhale' | 'rest') {
    this.breathPhase = phase;
  }

  create() {
    super.create();
    this.gameState.isPlaying = true;
    
    // Initialize fish sprite
    const fish = this.getSprite('pufferfish');
    if (fish) {
      fish.setVisible(true)
        .setPosition(100, this.gameState.fishPosition * 4)
        .setScale(this.gameState.fishSize);
    }
  }

  update(time: number, delta: number) {
    if (!this.gameState.isPlaying) return;

    // Update fish size based on breath phase with delta time scaling
    const sizeChangeRate = 0.05 * (delta / 16.667);
    if (this.breathPhase === 'inhale') {
      this.gameState.fishSize = Math.min(1.5, this.gameState.fishSize + sizeChangeRate);
    } else if (this.breathPhase === 'exhale') {
      this.gameState.fishSize = Math.max(0.8, this.gameState.fishSize - sizeChangeRate);
    }

    // Update fish position with smooth interpolation
    const targetPosition = this.gameState.fishSize > 1.2 ? 
      Math.max(0, this.gameState.fishPosition - 2) :
      this.gameState.fishSize < 1 ?
        Math.min(100, this.gameState.fishPosition + 2) :
        this.gameState.fishPosition;

    this.gameState.fishPosition += (targetPosition - this.gameState.fishPosition) * 0.1;

    // Update score with delta time
    this.gameState.score += 0.1 * (delta / 16.667);
    this.onScoreUpdate(Math.floor(this.gameState.score));

    // Update fish sprite
    const fish = this.getSprite('pufferfish');
    if (fish) {
      fish.setPosition(100, this.gameState.fishPosition * 4)
          .setScale(this.gameState.fishSize);
    }
  }

  destroy() {
    this.gameState.isPlaying = false;
    super.destroy();
  }
}