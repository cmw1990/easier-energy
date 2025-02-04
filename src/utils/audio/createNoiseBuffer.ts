export const createNoiseBuffer = (context: AudioContext) => {
  const bufferSize = context.sampleRate * 2; // 2 seconds of noise
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
};