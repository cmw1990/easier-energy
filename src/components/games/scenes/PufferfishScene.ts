import { BreathingBaseScene } from './BreathingBaseScene';

interface GameState {
  score: number;
  fishPosition: number;
  fishSize: number;
  isPlaying: boolean;
}

export class PufferfishScene extends BreathingBaseScene {
  private gameState: GameState;
  private breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
  private onScoreUpdate: (score: number) => void;

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
  }

  setBreathPhase(phase: 'inhale' | 'hold' | 'exhale' | 'rest') {
    this.breathPhase = phase;
  }

  create() {
    super.create();
    
    // Initialize game objects
    const background = this.getSprite('background');
    if (background) {
      background.setVisible(true)
        .setPosition(this.cameras.main.centerX, this.cameras.main.centerY)
        .setDisplaySize(800, 400);
    }

    // Start game loop
    this.gameState.isPlaying = true;
  }

  update() {
    if (!this.gameState.isPlaying) return;

    // Update fish size based on breath phase
    if (this.breathPhase === 'inhale') {
      this.gameState.fishSize = Math.min(1.5, this.gameState.fishSize + 0.05);
    } else if (this.breathPhase === 'exhale') {
      this.gameState.fishSize = Math.max(0.8, this.gameState.fishSize - 0.05);
    }

    // Update fish position
    if (this.gameState.fishSize > 1.2) {
      this.gameState.fishPosition = Math.max(0, this.gameState.fishPosition - 2);
    } else if (this.gameState.fishSize < 1) {
      this.gameState.fishPosition = Math.min(100, this.gameState.fishPosition + 2);
    }

    // Update score
    this.gameState.score += 0.1;
    this.onScoreUpdate(Math.floor(this.gameState.score));

    // Update sprite positions and sizes
    const fish = this.getSprite('pufferfish');
    if (fish) {
      fish.setVisible(true)
        .setPosition(100, this.gameState.fishPosition * 4)
        .setScale(this.gameState.fishSize);
    }
  }

  destroy() {
    this.gameState.isPlaying = false;
  }
}