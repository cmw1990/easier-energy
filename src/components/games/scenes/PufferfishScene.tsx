import { Scene } from 'phaser';

export class PufferfishScene extends Scene {
  private pufferfish: Phaser.GameObjects.Sprite | null = null;
  private breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'rest';

  constructor() {
    super({ key: 'PufferfishScene' });
  }

  init(data: { breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' }) {
    this.breathPhase = data.breathPhase;
  }

  preload() {
    this.load.image('pufferfish', '/placeholder.svg');
    this.load.image('background', '/placeholder.svg');
  }

  create() {
    // Add background
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Add pufferfish in the center
    this.pufferfish = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'pufferfish'
    );
    
    // Set initial scale
    this.pufferfish.setScale(1);

    // Add smooth animations
    this.tweens.add({
      targets: this.pufferfish,
      scale: { from: 1, to: 1.5 },
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      paused: true
    });
  }

  update() {
    if (!this.pufferfish) return;

    // Update pufferfish based on breath phase
    const targetScale = this.breathPhase === 'inhale' ? 1.5 : 1;
    this.pufferfish.setScale(
      Phaser.Math.Linear(this.pufferfish.scale, targetScale, 0.1)
    );
  }
}