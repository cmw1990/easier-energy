class SoundEffectsService {
  private static instance: SoundEffectsService;
  private sounds: Map<string, HTMLAudioElement>;

  private constructor() {
    this.sounds = new Map();
    this.initializeSounds();
  }

  public static getInstance(): SoundEffectsService {
    if (!SoundEffectsService.instance) {
      SoundEffectsService.instance = new SoundEffectsService();
    }
    return SoundEffectsService.instance;
  }

  private initializeSounds() {
    // Add your sound effects here
    this.addSound('achievement', '/sounds/achievement.mp3');
    this.addSound('notification', '/sounds/notification.mp3');
    this.addSound('success', '/sounds/success.mp3');
  }

  private addSound(name: string, path: string) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
  }

  public play(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  }

  public setVolume(volume: number) {
    this.sounds.forEach(sound => {
      sound.volume = Math.max(0, Math.min(1, volume));
    });
  }
}

export const soundEffects = SoundEffectsService.getInstance();