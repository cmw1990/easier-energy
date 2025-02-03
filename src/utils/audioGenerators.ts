// Audio Context singleton to prevent multiple instances
let audioContextInstance: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContextInstance) {
    audioContextInstance = new AudioContext();
  }
  return audioContextInstance;
};

// Create noise buffer for base sound
const createNoiseBuffer = (context: AudioContext) => {
  const bufferSize = context.sampleRate * 2; // 2 seconds of noise
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
};

type NatureSound = 'ocean' | 'rain' | 'wind' | 'forest';

// Frequency modulation for wind effect
const createWindModulation = (context: AudioContext, frequency: number, depth: number) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  
  oscillator.frequency.value = frequency;
  gain.gain.value = depth;
  oscillator.connect(gain);
  oscillator.start();
  
  return gain;
};

export const generateNatureSound = (type: NatureSound, volume = 0.5) => {
  const context = getAudioContext();
  const masterGain = context.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(context.destination);

  const noiseBuffer = createNoiseBuffer(context);
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  switch (type) {
    case 'ocean': {
      // Ocean waves using filtered noise and slow modulation
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 850;
      filter.Q.value = 0.5;

      const modulator = createWindModulation(context, 0.1, 400);
      modulator.connect(filter.frequency);

      noiseSource.connect(filter);
      filter.connect(masterGain);
      break;
    }
    case 'rain': {
      // Rain effect using filtered noise and resonance
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      filter.Q.value = 0.2;

      noiseSource.connect(filter);
      filter.connect(masterGain);
      break;
    }
    case 'wind': {
      // Wind effect using modulated filtered noise
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 1.0;

      const modulator = createWindModulation(context, 0.2, 200);
      modulator.connect(filter.frequency);

      noiseSource.connect(filter);
      filter.connect(masterGain);
      break;
    }
    case 'forest': {
      // Forest ambience using multiple filtered layers
      const highFilter = context.createBiquadFilter();
      highFilter.type = 'highpass';
      highFilter.frequency.value = 2000;
      highFilter.Q.value = 0.5;

      const lowFilter = context.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.value = 400;
      lowFilter.Q.value = 0.5;

      // Subtle modulation for movement
      const modulator = createWindModulation(context, 0.3, 100);
      modulator.connect(highFilter.frequency);

      noiseSource.connect(highFilter);
      noiseSource.connect(lowFilter);
      highFilter.connect(masterGain);
      lowFilter.connect(masterGain);
      break;
    }
  }

  noiseSource.start();
  return {
    stop: () => {
      noiseSource.stop();
      masterGain.disconnect();
    },
    setVolume: (newVolume: number) => {
      masterGain.gain.value = newVolume;
    }
  };
};

// Binaural beat generator
export const generateBinauralBeat = (baseFreq: number, beatFreq: number, volume = 0.5) => {
  const context = getAudioContext();
  const masterGain = context.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(context.destination);

  // Create two oscillators slightly detuned
  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();
  
  // Pan oscillators left and right
  const panLeft = context.createStereoPanner();
  const panRight = context.createStereoPanner();
  
  panLeft.pan.value = -1;
  panRight.pan.value = 1;

  osc1.frequency.value = baseFreq;
  osc2.frequency.value = baseFreq + beatFreq;

  osc1.connect(panLeft);
  osc2.connect(panRight);
  panLeft.connect(masterGain);
  panRight.connect(masterGain);

  osc1.start();
  osc2.start();

  return {
    stop: () => {
      osc1.stop();
      osc2.stop();
      masterGain.disconnect();
    },
    setVolume: (newVolume: number) => {
      masterGain.gain.value = newVolume;
    }
  };
};