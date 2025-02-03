import { Motion } from '@capacitor/motion';

export class MotionService {
  private static instance: MotionService;
  private isListening = false;

  private constructor() {}

  static getInstance(): MotionService {
    if (!MotionService.instance) {
      MotionService.instance = new MotionService();
    }
    return MotionService.instance;
  }

  async startAccelerometerListening() {
    try {
      if (!this.isListening) {
        await Motion.addListener('accel', event => {
          console.log('Motion data:', event);
          // Here we can later implement logic to detect steps or activity
          // based on accelerometer data
        });
        this.isListening = true;
      }
    } catch (error) {
      console.error('Error starting accelerometer:', error);
    }
  }

  async stopAccelerometerListening() {
    try {
      await Motion.removeAllListeners();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping accelerometer:', error);
    }
  }
}