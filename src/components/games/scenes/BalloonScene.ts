import Phaser from 'phaser';

export class BalloonScene extends Phaser.Scene {
  private balloon!: Phaser.GameObjects.Image;
  private background!: Phaser.GameObjects.TileSprite;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameWidth: number = 800;
  private gameHeight: number = 400;
  private isGameOver: boolean = false;
  private breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'rest';
  private particleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'BalloonScene' });
  }

  preload() {
    this.load.image('balloon', '/src/assets/games/balloon/balloon.png');
    this.load.image('background', '/src/assets/games/balloon/background.png');
    this.load.image('cloud', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD1JREFUeNpiYGBg2M9ABGBiIBKMGIHM/VgUHGBgYDgIZB9ggrKPAfFGKPs/ED+Asq8D8Qkg/shAIgAIMADxZxDaT9PhwAAAAABJRU5ErkJggg==');
  }

  create() {
    // Create scrolling background
    this.background = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // Add balloon sprite
    this.balloon = this.add.image(this.gameWidth / 4, this.gameHeight / 2, 'balloon')
      .setScale(0.5);

    // Create particle system for clouds
    const particles = this.add.particles(0, 0, 'cloud');
    
    this.particleEmitter = particles.createEmitter({
      x: this.gameWidth + 50,
      y: { min: 50, max: this.gameHeight - 50 },
      speedX: { min: -200, max: -150 },
      speedY: { min: -20, max: 20 },
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      scale: { start: 0.6, end: 0.3 },
      alpha: { start: 0.6, end: 0 },
      lifespan: { min: 2000, max: 3000 },
      frequency: 500,
      blendMode: 'ADD'
    });

    // Add score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#000'
    });

    // Start game
    this.isGameOver = false;
    this.score = 0;
  }

  setBreathPhase(phase: 'inhale' | 'hold' | 'exhale' | 'rest') {
    this.breathPhase = phase;
  }

  update() {
    if (this.isGameOver) return;

    // Scroll background
    this.background.tilePositionX += 2;

    // Update balloon position based on breath phase
    switch (this.breathPhase) {
      case 'inhale':
        this.balloon.y = Math.max(
          this.balloon.height / 2,
          this.balloon.y - 3
        );
        break;
      case 'exhale':
        this.balloon.y = Math.min(
          this.gameHeight - this.balloon.height / 2,
          this.balloon.y + 2
        );
        break;
      case 'hold':
        // Slight floating effect during hold
        this.balloon.y += Math.sin(this.time.now / 500) * 0.5;
        break;
      case 'rest':
        // Gentle falling when resting
        this.balloon.y = Math.min(
          this.gameHeight - this.balloon.height / 2,
          this.balloon.y + 1
        );
        break;
    }

    // Update score
    this.score += 0.1;
    this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
  }

  getScore(): number {
    return Math.floor(this.score);
  }

  endGame() {
    this.isGameOver = true;
    this.particleEmitter.stop();
  }
}