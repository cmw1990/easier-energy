import { generateBinauralBeat, generateNatureSound, type NatureSound } from './audioGenerators';

type MeditationType = 'mindfulness' | 'focus' | 'energy' | 'stress-relief' | 'sleep' | 'advanced';

interface AudioState {
  binaural: ReturnType<typeof generateBinauralBeat> | null;
  nature: ReturnType<typeof generateNatureSound> | null;
}

export const getMeditationAudioSettings = (type: MeditationType): {
  binauralFreq: number;
  binauralBeat: number;
  natureSound: NatureSound;
} => {
  switch (type) {
    case 'mindfulness':
      return {
        binauralFreq: 432,
        binauralBeat: 10,
        natureSound: 'stream'
      };
    case 'focus':
      return {
        binauralFreq: 528,
        binauralBeat: 15,
        natureSound: 'wind'
      };
    case 'energy':
      return {
        binauralFreq: 528,
        binauralBeat: 20,
        natureSound: 'birds'
      };
    case 'stress-relief':
      return {
        binauralFreq: 396,
        binauralBeat: 6,
        natureSound: 'rain'
      };
    case 'sleep':
      return {
        binauralFreq: 396,
        binauralBeat: 4,
        natureSound: 'ocean'
      };
    case 'advanced':
      return {
        binauralFreq: 432,
        binauralBeat: 7.83, // Schumann resonance
        natureSound: 'forest'
      };
  }
};

export const createMeditationAudio = (type: MeditationType, volume = 0.5): AudioState => {
  const settings = getMeditationAudioSettings(type);
  
  const binaural = generateBinauralBeat(
    settings.binauralFreq,
    settings.binauralBeat,
    volume * 0.4 // Binaural beats slightly quieter
  );
  
  const nature = generateNatureSound(settings.natureSound, volume * 0.6);
  
  return { binaural, nature };
};

export const stopMeditationAudio = (audioState: AudioState) => {
  audioState.binaural?.stop();
  audioState.nature?.stop();
};

export const updateMeditationVolume = (audioState: AudioState, volume: number) => {
  audioState.binaural?.setVolume(volume * 0.4);
  audioState.nature?.setVolume(volume * 0.6);
};