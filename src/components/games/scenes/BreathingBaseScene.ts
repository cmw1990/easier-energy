import Phaser from 'phaser';

export class BreathingBaseScene extends Phaser.Scene {
  private assets: Record<string, string>;
  private loadedAssets: Map<string, Phaser.GameObjects.Image>;
  
  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
    this.assets = {};
    this.loadedAssets = new Map();
  }

  setAssets(assets: Record<string, string>) {
    this.assets = assets;
  }

  preload() {
    // Show loading progress
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    // Loading event handlers
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load all assets
    Object.entries(this.assets).forEach(([key, url]) => {
      this.load.image(key, url);
    });
  }

  create() {
    // Create sprite pool
    Object.keys(this.assets).forEach(key => {
      const sprite = this.add.image(0, 0, key);
      sprite.setVisible(false);
      this.loadedAssets.set(key, sprite);
    });
  }

  getSprite(key: string): Phaser.GameObjects.Image | undefined {
    return this.loadedAssets.get(key);
  }
}