import Phaser from 'phaser';

export class PufferfishScene extends Phaser.Scene {
  private pufferfish: Phaser.GameObjects.Sprite | null = null;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private assets: Record<string, string> = {};
  private setScoreCallback: (score: number) => void;
  private currentScore: number = 0;
  private breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'rest';

  constructor(setScore: (score: number) => void) {
    super({ key: 'PufferfishScene' });
    this.setScoreCallback = setScore;
  }

  setAssets(assets: Record<string, string>) {
    this.assets = assets;
    if (this.scene.isActive()) {
      this.scene.restart();
    }
  }

  setBreathPhase(phase: 'inhale' | 'hold' | 'exhale' | 'rest') {
    this.breathPhase = phase;
  }

  preload() {
    if (this.assets.pufferfish) {
      this.load.image('pufferfish', this.assets.pufferfish);
    }
    if (this.assets.bubbles) {
      this.load.image('bubbles', this.assets.bubbles);
    }
    if (this.assets.background) {
      this.load.image('background', this.assets.background);
    }
  }

  create() {
    // Add background
    this.add.image(400, 200, 'background').setScale(2);

    // Create pufferfish sprite
    this.pufferfish = this.add.sprite(400, 200, 'pufferfish');
    this.pufferfish.setScale(0.5);

    // Create particle system for bubbles
    const particles = this.add.particles(0, 0, 'bubbles');
    this.emitter = particles.createEmitter({
      x: { min: 380, max: 420 },
      y: { min: 190, max: 210 },
      speedX: { min: 0, max: 0 },
      speedY: { min: -50, max: -100 },
      angle: { min: 260, max: 280 },
      scale: { start: 0.4, end: 0.1 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 2000,
      frequency: 100,
      quantity: 1,
      active: true
    });

    // Start game loop
    this.time.addEvent({
      delay: 100,
      callback: this.updateScore,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (!this.pufferfish) return;

    // Update pufferfish position and scale based on breath phase
    switch (this.breathPhase) {
      case 'inhale':
        this.pufferfish.setScale(Math.min(this.pufferfish.scale + 0.01, 0.8));
        this.pufferfish.y = Math.max(this.pufferfish.y - 1, 50);
        if (this.emitter) {
          this.emitter.setPosition(this.pufferfish.x, this.pufferfish.y + 20);
          this.emitter.setFrequency(50);
        }
        break;
      case 'exhale':
        this.pufferfish.setScale(Math.max(this.pufferfish.scale - 0.01, 0.3));
        this.pufferfish.y = Math.min(this.pufferfish.y + 1, 350);
        if (this.emitter) {
          this.emitter.setPosition(this.pufferfish.x, this.pufferfish.y + 20);
          this.emitter.setFrequency(200);
        }
        break;
      case 'hold':
        if (this.emitter) {
          this.emitter.setFrequency(1000);
        }
        break;
      case 'rest':
        if (this.emitter) {
          this.emitter.setFrequency(500);
        }
        break;
    }

    // Gentle floating animation
    this.pufferfish.x += Math.sin(this.time.now / 1000) * 0.5;
  }

  private updateScore() {
    this.currentScore += 1;
    this.setScoreCallback(this.currentScore);
  }
}