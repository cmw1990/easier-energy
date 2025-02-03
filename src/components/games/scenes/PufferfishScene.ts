import { BreathingBaseScene } from './BreathingBaseScene';

interface GameState {
  score: number;
  fishPosition: number;
  fishSize: number;
  isPlaying: boolean;
  health: number;
}

interface GameObject {
  sprite: Phaser.GameObjects.Image;
  speed: number;
  active: boolean;
}

export class PufferfishScene extends BreathingBaseScene {
  private gameState: GameState;
  private breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
  private onScoreUpdate: (score: number) => void;
  private smallFish: GameObject[];
  private predators: GameObject[];
  private bubbles: Phaser.GameObjects.Particles.ParticleEmitter | null;
  private seaweed: Phaser.GameObjects.Image[];
  private lastBubbleTime: number;

  constructor(onScoreUpdate: (score: number) => void) {
    super({ key: 'PufferfishScene' });
    this.gameState = {
      score: 0,
      fishPosition: 200,
      fishSize: 1,
      isPlaying: false,
      health: 100
    };
    this.breathPhase = 'rest';
    this.onScoreUpdate = onScoreUpdate;
    this.smallFish = [];
    this.predators = [];
    this.seaweed = [];
    this.bubbles = null;
    this.lastBubbleTime = 0;
  }

  setBreathPhase(phase: 'inhale' | 'hold' | 'exhale' | 'rest') {
    this.breathPhase = phase;
  }

  create() {
    super.create();
    this.gameState.isPlaying = true;
    
    // Initialize player fish with improved physics
    const fish = this.getSprite('pufferfish');
    if (fish) {
      fish.setVisible(true)
        .setPosition(100, this.gameState.fishPosition)
        .setScale(this.gameState.fishSize)
        .setDepth(1);
    }

    // Initialize seaweed decorations
    for (let i = 0; i < 5; i++) {
      const seaweed = this.add.image(
        Phaser.Math.Between(0, 800),
        380,
        'seaweed'
      );
      seaweed.setOrigin(0.5, 1).setScale(0.8).setDepth(0);
      this.seaweed.push(seaweed);
    }

    // Setup particle system for bubbles
    const particles = this.add.particles('bubbles');
    if (particles) {
      const emitter = particles.createEmitter({
        x: 0,
        y: 0,
        speed: { min: 50, max: 100 },
        angle: { min: -85, max: -95 },
        scale: { start: 0.4, end: 0.2 },
        alpha: { start: 0.8, end: 0 },
        lifespan: 2000,
        quantity: 1,
        frequency: 100,
        on: false
      });
      this.bubbles = emitter;
    }

    // Start spawning game objects
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnSmallFish,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 3000,
      callback: this.spawnPredator,
      callbackScope: this,
      loop: true
    });
  }

  private spawnSmallFish = () => {
    const sprite = this.add.image(850, Phaser.Math.Between(50, 350), 'smallFish');
    sprite.setScale(0.6);
    this.smallFish.push({
      sprite,
      speed: Phaser.Math.Between(100, 200),
      active: true
    });
  };

  private spawnPredator = () => {
    const sprite = this.add.image(850, Phaser.Math.Between(50, 350), 'predator');
    sprite.setScale(0.8);
    this.predators.push({
      sprite,
      speed: Phaser.Math.Between(150, 250),
      active: true
    });
  };

  private updateGameObjects(delta: number) {
    // Update small fish
    this.smallFish.forEach((fish, index) => {
      if (!fish.active) return;
      
      fish.sprite.x -= (fish.speed * delta) / 1000;
      
      // Check collision with player
      const playerFish = this.getSprite('pufferfish');
      if (playerFish && this.checkCollision(playerFish, fish.sprite)) {
        this.gameState.score += 10;
        this.onScoreUpdate(Math.floor(this.gameState.score));
        fish.active = false;
        fish.sprite.destroy();
        this.smallFish.splice(index, 1);
      }
      
      // Remove if off screen
      if (fish.sprite.x < -50) {
        fish.sprite.destroy();
        this.smallFish.splice(index, 1);
      }
    });

    // Update predators
    this.predators.forEach((predator, index) => {
      if (!predator.active) return;
      
      predator.sprite.x -= (predator.speed * delta) / 1000;
      
      // Check collision with player
      const playerFish = this.getSprite('pufferfish');
      if (playerFish && this.checkCollision(playerFish, predator.sprite)) {
        this.gameState.health -= 20;
        predator.active = false;
        predator.sprite.destroy();
        this.predators.splice(index, 1);
        
        if (this.gameState.health <= 0) {
          this.gameOver();
        }
      }
      
      // Remove if off screen
      if (predator.sprite.x < -50) {
        predator.sprite.destroy();
        this.predators.splice(index, 1);
      }
    });

    // Animate seaweed
    this.seaweed.forEach((seaweed, index) => {
      seaweed.rotation = Math.sin(this.time.now / 1000 + index) * 0.1;
    });
  }

  private checkCollision(obj1: Phaser.GameObjects.Image, obj2: Phaser.GameObjects.Image): boolean {
    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2);
  }

  private gameOver() {
    this.gameState.isPlaying = false;
    this.scene.pause();
    // The parent component will handle the game over state
  }

  update(time: number, delta: number) {
    if (!this.gameState.isPlaying) return;

    // Update fish size based on breath phase
    const sizeChangeRate = 0.003 * delta;
    if (this.breathPhase === 'inhale') {
      this.gameState.fishSize = Math.min(1.5, this.gameState.fishSize + sizeChangeRate);
      if (time - this.lastBubbleTime > 100) {
        this.emitBubbles();
        this.lastBubbleTime = time;
      }
    } else if (this.breathPhase === 'exhale') {
      this.gameState.fishSize = Math.max(0.8, this.gameState.fishSize - sizeChangeRate);
    }

    // Update fish position with smooth interpolation
    const targetY = this.gameState.fishSize > 1.2 ? 
      Math.max(50, this.gameState.fishPosition - 2) :
      this.gameState.fishSize < 1 ?
        Math.min(350, this.gameState.fishPosition + 2) :
        this.gameState.fishPosition;

    this.gameState.fishPosition += (targetY - this.gameState.fishPosition) * 0.1;

    // Update player fish sprite
    const fish = this.getSprite('pufferfish');
    if (fish) {
      fish.setPosition(100, this.gameState.fishPosition)
          .setScale(this.gameState.fishSize)
          .setRotation(Math.sin(time * 0.003) * 0.1);
    }

    // Update game objects
    this.updateGameObjects(delta);

    // Increment score based on survival time
    this.gameState.score += 0.01 * delta;
    this.onScoreUpdate(Math.floor(this.gameState.score));
  }

  private emitBubbles() {
    if (this.bubbles && this.getSprite('pufferfish')) {
      const fish = this.getSprite('pufferfish');
      if (fish) {
        this.bubbles.setPosition(fish.x, fish.y);
        this.bubbles.explode();
      }
    }
  }

  destroy() {
    this.gameState.isPlaying = false;
    this.smallFish.forEach(fish => fish.sprite.destroy());
    this.predators.forEach(predator => predator.sprite.destroy());
    this.seaweed.forEach(seaweed => seaweed.destroy());
    if (this.bubbles) {
      this.bubbles.stop();
    }
    super.destroy();
  }
}