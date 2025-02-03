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
    this.fpsUpdateInterval = 1000; // Update FPS every second
  }

  setBreathPhase(phase: 'inhale' | 'hold' | 'exhale' | 'rest') {
    this.breathPhase = phase;
  }

  private initParticlePool() {
    // Pre-create a pool of particle emitters
    for (let i = 0; i < 10; i++) {
      const emitter = this.add.particles(0, 0, 'bubble', {
        speed: { min: 50, max: 100 },
        scale: { start: 0.2, end: 0 },
        lifespan: 2000,
        blendMode: 'ADD',
        frequency: -1 // Manual launching
      });
      this.particlePool.inactive.push(emitter);
    }
  }

  private getParticleEmitter(): Phaser.GameObjects.Particles.ParticleEmitter {
    if (this.particlePool.inactive.length > 0) {
      const emitter = this.particlePool.inactive.pop()!;
      this.particlePool.active.push(emitter);
      return emitter;
    }
    // If no inactive emitters, recycle the oldest active one
    const recycled = this.particlePool.active.shift()!;
    this.particlePool.active.push(recycled);
    return recycled;
  }

  create() {
    super.create();
    
    // Initialize game objects with texture atlas if available
    const background = this.getSprite('background');
    if (background) {
      background.setVisible(true)
        .setPosition(this.cameras.main.centerX, this.cameras.main.centerY)
        .setDisplaySize(800, 400);
    }

    this.initParticlePool();

    // Enable FPS monitoring
    this.lastFrameTime = performance.now();
    this.frameCount = 0;

    // Start game loop with efficient frame timing
    this.gameState.isPlaying = true;
  }

  update(time: number, delta: number) {
    if (!this.gameState.isPlaying) return;

    // Efficient frame timing
    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastFrameTime >= this.fpsUpdateInterval) {
      const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFrameTime));
      console.log(`Current FPS: ${fps}`);
      this.frameCount = 0;
      this.lastFrameTime = currentTime;
    }

    // Update fish size based on breath phase with delta time scaling
    const sizeChangeRate = 0.05 * (delta / 16.667); // Normalize for 60fps
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

    // Efficient sprite updates using object pooling for particles
    if (this.breathPhase === 'exhale') {
      const emitter = this.getParticleEmitter();
      emitter.setPosition(100, this.gameState.fishPosition * 4);
      emitter.start();
    }

    // Update sprite positions and sizes with efficient batching
    const fish = this.getSprite('pufferfish');
    if (fish) {
      fish.setVisible(true)
        .setPosition(100, this.gameState.fishPosition * 4)
        .setScale(this.gameState.fishSize);
    }
  }

  destroy() {
    // Proper cleanup of resources
    this.gameState.isPlaying = false;
    this.particlePool.active.forEach(emitter => emitter.destroy());
    this.particlePool.inactive.forEach(emitter => emitter.destroy());
    this.particlePool.active = [];
    this.particlePool.inactive = [];
    super.destroy();
  }
}