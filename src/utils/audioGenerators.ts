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

type NatureSound = 'ocean' | 'rain' | 'wind' | 'forest' | 'thunder' | 'crickets' | 'birds' | 'stream';

// Frequency modulation for effects
const createModulation = (context: AudioContext, frequency: number, depth: number) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  
  oscillator.frequency.value = frequency;
  gain.gain.value = depth;
  oscillator.connect(gain);
  oscillator.start();
  
  return gain;
};

// Create random bursts for thunder
const createThunderBurst = (context: AudioContext, masterGain: GainNode) => {
  const burstGain = context.createGain();
  const filter = context.createBiquadFilter();
  
  filter.type = 'lowpass';
  filter.frequency.value = 100;
  
  const noise = context.createBufferSource();
  noise.buffer = createNoiseBuffer(context);
  
  noise.connect(filter);
  filter.connect(burstGain);
  burstGain.connect(masterGain);
  
  burstGain.gain.setValueAtTime(0, context.currentTime);
  burstGain.gain.linearRampToValueAtTime(0.8, context.currentTime + 0.1);
  burstGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2);
  
  noise.start();
  noise.stop(context.currentTime + 2);
  
  setTimeout(() => {
    if (Math.random() > 0.7) {
      createThunderBurst(context, masterGain);
    }
  }, Math.random() * 10000 + 5000);
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
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 850;
      filter.Q.value = 0.5;

      const modulator = createModulation(context, 0.1, 400);
      modulator.connect(filter.frequency);

      noiseSource.connect(filter);
      filter.connect(masterGain);
      break;
    }
    case 'rain': {
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      filter.Q.value = 0.2;

      noiseSource.connect(filter);
      filter.connect(masterGain);
      break;
    }
    case 'wind': {
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 1.0;

      const modulator = createModulation(context, 0.2, 200);
      modulator.connect(filter.frequency);

      noiseSource.connect(filter);
      filter.connect(masterGain);
      break;
    }
    case 'forest': {
      const highFilter = context.createBiquadFilter();
      highFilter.type = 'highpass';
      highFilter.frequency.value = 2000;
      highFilter.Q.value = 0.5;

      const lowFilter = context.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.value = 400;
      lowFilter.Q.value = 0.5;

      const modulator = createModulation(context, 0.3, 100);
      modulator.connect(highFilter.frequency);

      noiseSource.connect(highFilter);
      noiseSource.connect(lowFilter);
      highFilter.connect(masterGain);
      lowFilter.connect(masterGain);
      break;
    }
    case 'thunder': {
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 100;
      
      noiseSource.connect(filter);
      filter.connect(masterGain);
      
      createThunderBurst(context, masterGain);
      break;
    }
    case 'crickets': {
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 4500;
      filter.Q.value = 10;

      const modulator = createModulation(context, 20, 0.7);
      const modulatorGain = context.createGain();
      modulatorGain.gain.value = 0.3;
      
      modulator.connect(modulatorGain);
      modulatorGain.connect(filter.frequency);

      noiseSource.connect(filter);
      filter.connect(masterGain);
      break;
    }
    case 'birds': {
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 5;

      const chirpModulator = createModulation(context, 10, 1000);
      chirpModulator.connect(filter.frequency);

      noiseSource.connect(filter);
      filter.connect(masterGain);

      // Random chirps
      setInterval(() => {
        if (Math.random() > 0.7) {
          filter.frequency.setTargetAtTime(2000 + Math.random() * 2000, context.currentTime, 0.1);
        }
      }, 1000);
      break;
    }
    case 'stream': {
      const filter1 = context.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.value = 600;
      filter1.Q.value = 1;

      const filter2 = context.createBiquadFilter();
      filter2.type = 'highpass';
      filter2.frequency.value = 2000;
      filter2.Q.value = 0.5;

      const modulator = createModulation(context, 0.5, 200);
      modulator.connect(filter1.frequency);

      noiseSource.connect(filter1);
      noiseSource.connect(filter2);
      filter1.connect(masterGain);
      filter2.connect(masterGain);
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