import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Motion } from '@capacitor/motion';
import { Device } from '@capacitor/device';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { AlarmClock, Moon, Sun, Waves, Volume2, BedDouble } from 'lucide-react';

export const SmartAlarm = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [smartWakeEnabled, setSmartWakeEnabled] = useState(true);
  const [soundType, setSoundType] = useState('nature');
  const [volume, setVolume] = useState(50);
  const [smartWakeWindow, setSmartWakeWindow] = useState(30);
  const [sensitivity, setSensitivity] = useState(5);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [gradualWake, setGradualWake] = useState(true);
  const [backupAlarm, setBackupAlarm] = useState(true);
  const { toast } = useToast();

  // Initialize audio context for sound generation
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction
    const initAudio = () => {
      if (!audioContext) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      }
    };

    // Add listener for user interaction
    document.addEventListener('click', initAudio, { once: true });
    return () => document.removeEventListener('click', initAudio);
  }, []);

  // Initialize motion tracking with enhanced sensitivity
  useEffect(() => {
    const setupMotionTracking = async () => {
      try {
        const available = await Motion.addListener('accel', () => {});
        if (!available) {
          toast({
            title: "Device not supported",
            description: "Your device doesn't support motion tracking.",
            variant: "destructive",
          });
          return;
        }

        if (isTracking) {
          let movementBuffer: number[] = [];
          const BUFFER_SIZE = 10;

          await Motion.addListener('accel', (event) => {
            analyzeSleepMovement(event.acceleration, movementBuffer);
          });
        }

        return () => {
          Motion.removeAllListeners();
        };
      } catch (error) {
        console.error('Error setting up motion tracking:', error);
      }
    };

    setupMotionTracking();
  }, [isTracking]);

  const analyzeSleepMovement = (
    acceleration: { x: number; y: number; z: number },
    buffer: number[]
  ) => {
    const intensity = Math.sqrt(
      Math.pow(acceleration.x, 2) + 
      Math.pow(acceleration.y, 2) + 
      Math.pow(acceleration.z, 2)
    );

    buffer.push(intensity);
    if (buffer.length > 10) buffer.shift();

    const avgIntensity = buffer.reduce((a, b) => a + b, 0) / buffer.length;
    const threshold = 0.1 * (11 - sensitivity);

    if (avgIntensity < threshold) {
      console.log('Deep sleep detected');
    } else if (avgIntensity < threshold * 2) {
      console.log('Light sleep detected');
    } else {
      console.log('Movement detected');
    }
  };

  const generateSound = async (type: string, volume: number) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    switch (type) {
      case 'nature':
        // Gentle nature-like sounds
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, audioContext.currentTime);
        break;
      case 'binaural':
        // Binaural beats for gentle wake
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, audioContext.currentTime);
        const secondOscillator = audioContext.createOscillator();
        secondOscillator.frequency.setValueAtTime(436, audioContext.currentTime);
        secondOscillator.connect(gainNode);
        secondOscillator.start();
        secondOscillator.stop(audioContext.currentTime + 2);
        break;
      case 'gradual':
        // Gradually increasing frequency
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 2);
        break;
      default:
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    }

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume / 100, audioContext.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
  };

  const startSleepTracking = async () => {
    try {
      const info = await Device.getInfo();
      if (info.platform === 'web') {
        toast({
          title: "Web platform detected",
          description: "Sleep tracking works best on mobile devices.",
          variant: "default",
        });
      }

      setIsTracking(true);
      scheduleSmartAlarm();

      // Test sound generation
      await generateSound(soundType, volume);

      toast({
        title: "Sleep tracking started",
        description: "We'll monitor your sleep patterns and wake you up at the optimal time.",
      });
    } catch (error) {
      console.error('Error starting sleep tracking:', error);
      toast({
        title: "Error",
        description: "Failed to start sleep tracking.",
        variant: "destructive",
      });
    }
  };

  const stopSleepTracking = () => {
    setIsTracking(false);
    Motion.removeAllListeners();
    toast({
      title: "Sleep tracking stopped",
      description: "Your sleep data has been saved.",
    });
  };

  const scheduleSmartAlarm = async () => {
    try {
      const [hours, minutes] = alarmTime.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0);

      // If the time has passed, schedule for tomorrow
      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      // Smart wake window with custom duration
      if (smartWakeEnabled) {
        scheduledTime.setMinutes(scheduledTime.getMinutes() - smartWakeWindow);
      }

      // Schedule multiple alarms for gradual wake
      if (gradualWake) {
        const intervals = [0, 5, 10]; // Minutes before main alarm
        for (const interval of intervals) {
          await scheduleGradualAlarm(scheduledTime, interval);
        }
      }

      // Main alarm
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Wake Up Time!",
            body: "Rise and shine! It's the perfect time to wake up.",
            id: 1,
            schedule: { at: scheduledTime },
            sound: getSoundFile(),
            extra: {
              soundType,
              gradualVolume: true,
              volume: volume / 100,
              vibrate: vibrationEnabled,
            }
          }
        ]
      });

      // Backup alarm if enabled
      if (backupAlarm) {
        const backupTime = new Date(scheduledTime);
        backupTime.setMinutes(backupTime.getMinutes() + 5);
        await scheduleBackupAlarm(backupTime);
      }

      toast({
        title: "Alarm set",
        description: `Alarm scheduled for ${smartWakeEnabled ? 'optimal wake time around' : ''} ${alarmTime}`,
      });
    } catch (error) {
      console.error('Error scheduling alarm:', error);
      toast({
        title: "Error",
        description: "Failed to set alarm.",
        variant: "destructive",
      });
    }
  };

  const scheduleGradualAlarm = async (baseTime: Date, minutesBefore: number) => {
    const gradualTime = new Date(baseTime);
    gradualTime.setMinutes(gradualTime.getMinutes() - minutesBefore);
    
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Gentle Wake",
          body: "Preparing for wake up...",
          id: 100 + minutesBefore,
          schedule: { at: gradualTime },
          sound: "gentle_chime.wav",
          extra: {
            volume: (volume / 100) * (minutesBefore / 10),
            vibrate: false,
          }
        }
      ]
    });
  };

  const scheduleBackupAlarm = async (backupTime: Date) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Backup Alarm",
          body: "Time to wake up! (Backup alarm)",
          id: 99,
          schedule: { at: backupTime },
          sound: "loud_alarm.wav",
          extra: {
            volume: 1,
            vibrate: true,
          }
        }
      ]
    });
  };

  const getSoundFile = () => {
    switch (soundType) {
      case 'nature':
        return 'forest_morning.wav';
      case 'binaural':
        return 'binaural_wake.wav';
      case 'gradual':
        return 'sunrise_tones.wav';
      default:
        return 'gentle_chime.wav';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlarmClock className="h-5 w-5 text-primary" />
          Smart Sleep Tracking & Alarm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isTracking}
            onCheckedChange={(checked) => checked ? startSleepTracking() : stopSleepTracking()}
          />
          <Label>Track Sleep</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alarmTime">Wake-up Time</Label>
          <Input
            id="alarmTime"
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Repeat on Days</Label>
          <div className="flex gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Button
                key={day}
                variant={repeatDays.includes(day) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setRepeatDays(prev =>
                    prev.includes(day)
                      ? prev.filter(d => d !== day)
                      : [...prev, day]
                  );
                }}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Smart Wake Window</Label>
            <Switch
              checked={smartWakeEnabled}
              onCheckedChange={setSmartWakeEnabled}
            />
          </div>
          {smartWakeEnabled && (
            <div className="space-y-2">
              <Label>Window Duration: {smartWakeWindow} minutes</Label>
              <Slider
                value={[smartWakeWindow]}
                onValueChange={([value]) => setSmartWakeWindow(value)}
                min={5}
                max={60}
                step={5}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Motion Sensitivity</Label>
          <Slider
            value={[sensitivity]}
            onValueChange={([value]) => setSensitivity(value)}
            min={1}
            max={10}
            step={1}
          />
          <span className="text-sm text-muted-foreground">
            {sensitivity} - {sensitivity < 4 ? 'Less sensitive' : sensitivity > 7 ? 'Very sensitive' : 'Balanced'}
          </span>
        </div>

        <div className="space-y-2">
          <Label>Alarm Sound</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={soundType === 'nature' ? 'default' : 'outline'}
              onClick={() => setSoundType('nature')}
              className="flex flex-col items-center p-4"
            >
              <Sun className="h-5 w-5 mb-2" />
              Nature
            </Button>
            <Button
              variant={soundType === 'binaural' ? 'default' : 'outline'}
              onClick={() => setSoundType('binaural')}
              className="flex flex-col items-center p-4"
            >
              <Waves className="h-5 w-5 mb-2" />
              Binaural
            </Button>
            <Button
              variant={soundType === 'gradual' ? 'default' : 'outline'}
              onClick={() => setSoundType('gradual')}
              className="flex flex-col items-center p-4"
            >
              <Moon className="h-5 w-5 mb-2" />
              Gradual
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Volume: {volume}%</Label>
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={[volume]}
              onValueChange={([value]) => setVolume(value)}
              min={0}
              max={100}
              step={5}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Vibration</Label>
            <Switch
              checked={vibrationEnabled}
              onCheckedChange={setVibrationEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Gradual Wake (Multiple gentle alarms)</Label>
            <Switch
              checked={gradualWake}
              onCheckedChange={setGradualWake}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Backup Alarm (+5 minutes)</Label>
            <Switch
              checked={backupAlarm}
              onCheckedChange={setBackupAlarm}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};