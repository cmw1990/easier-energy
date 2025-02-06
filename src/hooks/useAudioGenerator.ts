
import { useState, useEffect } from "react";
import { createNoiseBuffer } from "@/utils/audio/createNoiseBuffer";
import { generateBinauralBeat, generateNatureSound } from "@/utils/audio";
import type { AudioState, AudioSettings } from "@/types/audio";

export const useAudioGenerator = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    noise: null,
    nature: null,
    binaural: null
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>({
    noiseType: 'white',
    noiseVolume: 0.5,
    natureSoundType: null,
    natureSoundVolume: 0,
    binauralFrequency: null,
    binauralVolume: 0
  });

  useEffect(() => {
    const initAudio = async () => {
      const context = new AudioContext();
      const gain = context.createGain();
      gain.connect(context.destination);
      gain.gain.value = settings.noiseVolume;
      
      setAudioContext(context);
      setGainNode(gain);
    };

    initAudio();

    return () => {
      stopAllSounds();
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const stopAllSounds = () => {
    if (audioState.noise) {
      audioState.noise.stop();
    }
    if (audioState.nature) {
      audioState.nature.stop();
    }
    if (audioState.binaural) {
      audioState.binaural.stop();
    }
    setAudioState({ noise: null, nature: null, binaural: null });
  };

  const toggleSound = async () => {
    if (!audioContext || !gainNode) return;

    if (isPlaying) {
      stopAllSounds();
      setIsPlaying(false);
      return false;
    } else {
      const newState: AudioState = { noise: null, nature: null, binaural: null };

      if (settings.noiseType !== 'off' && settings.noiseVolume > 0) {
        const buffer = createNoiseBuffer(audioContext, settings.noiseType);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const noiseGain = audioContext.createGain();
        noiseGain.gain.value = settings.noiseVolume;
        source.connect(noiseGain);
        noiseGain.connect(gainNode);
        
        source.start();
        newState.noise = source;
      }

      if (settings.natureSoundType && settings.natureSoundVolume > 0) {
        const natureSound = generateNatureSound(settings.natureSoundType, settings.natureSoundVolume);
        newState.nature = natureSound;
      }

      if (settings.binauralFrequency && settings.binauralVolume > 0) {
        const binauralBeat = generateBinauralBeat(432, settings.binauralFrequency, settings.binauralVolume);
        newState.binaural = binauralBeat;
      }

      setAudioState(newState);
      setIsPlaying(true);
      return true;
    }
  };

  const updateNoiseType = (type: AudioSettings['noiseType']) => {
    if (isPlaying) {
      stopAllSounds();
      setIsPlaying(false);
    }
    setSettings(prev => ({ ...prev, noiseType: type }));
  };

  const updateNatureSound = (type: NatureSound | null) => {
    if (audioState.nature) {
      audioState.nature.stop();
    }
    setSettings(prev => ({ ...prev, natureSoundType: type }));
  };

  const updateVolume = (type: 'noise' | 'nature' | 'binaural', value: number[]) => {
    const newVolume = value[0];
    
    setSettings(prev => ({
      ...prev,
      [`${type}Volume`]: newVolume
    }));

    if (isPlaying) {
      switch (type) {
        case 'noise':
          if (gainNode) {
            gainNode.gain.value = newVolume;
          }
          break;
        case 'nature':
          if (audioState.nature) {
            audioState.nature.setVolume(newVolume);
          }
          break;
        case 'binaural':
          if (audioState.binaural) {
            audioState.binaural.setVolume(newVolume);
          }
          break;
      }
    }
  };

  return {
    isPlaying,
    settings,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume
  };
};
