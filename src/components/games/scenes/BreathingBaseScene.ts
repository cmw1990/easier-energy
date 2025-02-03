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
    // Load all assets immediately
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

  shutdown() {
    // Clean up loaded assets
    this.loadedAssets.forEach(sprite => sprite.destroy());
    this.loadedAssets.clear();
  }

  destroy() {
    if (this.scene) {
      this.shutdown();
    }
  }
}