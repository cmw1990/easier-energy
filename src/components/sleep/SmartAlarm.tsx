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
import { 
  AlarmClock, Moon, Sun, Waves, Volume2, BedDouble, 
  Calendar, Repeat, Bell, Activity, Vibrate, Shield,
  CloudMoon, Sunrise, Music, Settings, Info 
} from 'lucide-react';
import { SleepAnalysis } from './SleepAnalysis';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const [weekdayAlarms, setWeekdayAlarms] = useState({
    monday: { enabled: false, time: '07:00' },
    tuesday: { enabled: false, time: '07:00' },
    wednesday: { enabled: false, time: '07:00' },
    thursday: { enabled: false, time: '07:00' },
    friday: { enabled: false, time: '07:00' },
    saturday: { enabled: false, time: '08:00' },
    sunday: { enabled: false, time: '08:00' },
  });
  const [napsEnabled, setNapsEnabled] = useState(false);
  const [napDuration, setNapDuration] = useState(20);
  const [weatherAware, setWeatherAware] = useState(false);
  const [powerNapMode, setPowerNapMode] = useState(false);
  const [sleepEnvironment, setSleepEnvironment] = useState({
    temperature: 20,
    humidity: 45,
    noise: 30,
    light: 5,
  });
  const [alarmProfile, setAlarmProfile] = useState('default');
  const [snoozeLimit, setSnoozeLimit] = useState(3);
  const [snoozeInterval, setSnoozeInterval] = useState(5);
  const [sleepQualityTracking, setSleepQualityTracking] = useState(true);
  const [sleepDebtAware, setSleepDebtAware] = useState(true);
  const [customSoundUrl, setCustomSoundUrl] = useState('');
  const [fallbackDevices, setFallbackDevices] = useState(true);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    return () => document.removeEventListener('click', initAudio);
  }, []);

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
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, audioContext.currentTime);
        break;
      case 'binaural':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, audioContext.currentTime);
        const secondOscillator = audioContext.createOscillator();
        secondOscillator.frequency.setValueAtTime(436, audioContext.currentTime);
        secondOscillator.connect(gainNode);
        secondOscillator.start();
        secondOscillator.stop(audioContext.currentTime + 2);
        break;
      case 'gradual':
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

  const handleWeekdayAlarmChange = (day: string, field: 'enabled' | 'time', value: boolean | string) => {
    setWeekdayAlarms(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const scheduleWeeklyAlarms = async () => {
    try {
      const notifications = Object.entries(weekdayAlarms)
        .filter(([_, settings]) => settings.enabled)
        .map(([day, settings], index) => {
          const dayNumber = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            .indexOf(day);
          const [hours, minutes] = settings.time.split(':').map(Number);
          
          return {
            title: "Smart Wake-up Time",
            body: `Good morning! It's your optimal wake time.`,
            id: 100 + index,
            schedule: {
              on: {
                weekday: dayNumber + 1
              },
              at: new Date(2024, 0, 1, hours, minutes)
            },
            extra: {
              soundType,
              gradualVolume: gradualWake,
              volume: volume / 100,
              vibrate: vibrationEnabled
            }
          };
        });

      await LocalNotifications.schedule({
        notifications
      });

      toast({
        title: "Weekly alarms set",
        description: "Your weekly wake-up schedule has been configured.",
      });
    } catch (error) {
      console.error('Error scheduling weekly alarms:', error);
      toast({
        title: "Error",
        description: "Failed to set weekly alarms.",
        variant: "destructive",
      });
    }
  };

  const scheduleNap = async (duration: number) => {
    try {
      const napTime = new Date();
      napTime.setMinutes(napTime.getMinutes() + duration);

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Nap Time Complete",
            body: `Your ${duration}-minute power nap is complete.`,
            id: 200,
            schedule: { at: napTime },
            sound: 'gentle_chime.wav',
            extra: {
              gradualVolume: true,
              volume: 0.7,
              vibrate: true
            }
          }
        ]
      });

      toast({
        title: "Nap timer set",
        description: `You'll be gently awakened in ${duration} minutes.`,
      });
    } catch (error) {
      console.error('Error scheduling nap:', error);
      toast({
        title: "Error",
        description: "Failed to set nap timer.",
        variant: "destructive",
      });
    }
  };

  const scheduleSmartAlarm = async () => {
    try {
      const [hours, minutes] = alarmTime.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0);

      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      if (smartWakeEnabled) {
        scheduledTime.setMinutes(scheduledTime.getMinutes() - smartWakeWindow);
      }

      if (gradualWake) {
        const intervals = [0, 5, 10];
        for (const interval of intervals) {
          await scheduleGradualAlarm(scheduledTime, interval);
        }
      }

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

  const renderFeatureTooltip = (title: string, description: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-semibold">{title}</p>
            <p className="text-sm">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlarmClock className="h-5 w-5 text-primary" />
          Advanced Sleep & Wake System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="quick-actions">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Quick Actions
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-6 h-auto"
                  onClick={() => scheduleNap(powerNapMode ? 20 : napDuration)}
                >
                  <CloudMoon className="h-6 w-6 mb-2" />
                  <span>Quick Nap</span>
                  <span className="text-sm text-muted-foreground">
                    {powerNapMode ? '20min Power Nap' : `${napDuration}min Rest`}
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-6 h-auto"
                  onClick={() => startSleepTracking()}
                >
                  <BedDouble className="h-6 w-6 mb-2" />
                  <span>Start Sleep</span>
                  <span className="text-sm text-muted-foreground">
                    With Smart Wake
                  </span>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="weekly-schedule">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Weekly Schedule
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {Object.entries(weekdayAlarms).map(([day, settings]) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={settings.enabled}
                        onCheckedChange={(checked) => 
                          handleWeekdayAlarmChange(day, 'enabled', checked)
                        }
                      />
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <Input
                      type="time"
                      value={settings.time}
                      onChange={(e) => 
                        handleWeekdayAlarmChange(day, 'time', e.target.value)
                      }
                      className="w-32"
                      disabled={!settings.enabled}
                    />
                  </div>
                ))}
                <Button 
                  className="w-full mt-4"
                  onClick={scheduleWeeklyAlarms}
                >
                  Save Weekly Schedule
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sound-settings">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Sound Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Wake-up Sound</Label>
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
                      <Sunrise className="h-5 w-5 mb-2" />
                      Gradual
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Custom Sound URL (Optional)</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/sound.mp3"
                    value={customSoundUrl}
                    onChange={(e) => setCustomSoundUrl(e.target.value)}
                  />
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

                <div className="flex items-center justify-between">
                  <Label>Vibration</Label>
                  <Switch
                    checked={vibrationEnabled}
                    onCheckedChange={setVibrationEnabled}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced-settings">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sleep Quality Tracking</Label>
                  <Switch
                    checked={sleepQualityTracking}
                    onCheckedChange={setSleepQualityTracking}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Sleep Debt Awareness</Label>
                  <Switch
                    checked={sleepDebtAware}
                    onCheckedChange={setSleepDebtAware}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Weather-Aware Wake-up</Label>
                  <Switch
                    checked={weatherAware}
                    onCheckedChange={setWeatherAware}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alarm Profile</Label>
                  <Select value={alarmProfile} onValueChange={setAlarmProfile}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="gentle">Gentle Wake</SelectItem>
                      <SelectItem value="energetic">Energetic Start</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Snooze Settings</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Max Snoozes</Label>
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        value={snoozeLimit}
                        onChange={(e) => setSnoozeLimit(parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Interval (min)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        value={snoozeInterval}
                        onChange={(e) => setSnoozeInterval(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Fallback Devices</Label>
                  <Switch
                    checked={fallbackDevices}
                    onCheckedChange={setFallbackDevices}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {isTracking && (
          <SleepAnalysis
            sleepData={{
              movements: [],
              startTime: new Date().toISOString(),
              duration: 0,
              sensitivity,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};
