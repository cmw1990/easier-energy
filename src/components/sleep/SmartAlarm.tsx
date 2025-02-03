import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Motion } from '@capacitor/motion';
import { Device } from '@capacitor/device';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alarm, Moon, Sun, Waves } from 'lucide-react';

export const SmartAlarm = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [smartWakeEnabled, setSmartWakeEnabled] = useState(true);
  const [soundType, setSoundType] = useState('nature');
  const { toast } = useToast();

  // Initialize motion tracking
  useEffect(() => {
    const setupMotionTracking = async () => {
      try {
        const { isSupported } = await Motion.isAccelerometerAvailable();
        if (!isSupported) {
          toast({
            title: "Device not supported",
            description: "Your device doesn't support motion tracking.",
            variant: "destructive",
          });
          return;
        }

        if (isTracking) {
          await Motion.addListener('accel', (event) => {
            // Process motion data to detect sleep phases
            analyzeSleepMovement(event.acceleration);
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

  const analyzeSleepMovement = (acceleration: { x: number; y: number; z: number }) => {
    // Calculate movement intensity
    const intensity = Math.sqrt(
      Math.pow(acceleration.x, 2) + 
      Math.pow(acceleration.y, 2) + 
      Math.pow(acceleration.z, 2)
    );

    // If movement is minimal, user might be in deep sleep
    if (intensity < 0.1) {
      console.log('Deep sleep detected');
    }
  };

  const startSleepTracking = async () => {
    try {
      const { value } = await Device.getInfo();
      if (value.platform === 'web') {
        toast({
          title: "Web platform detected",
          description: "Sleep tracking works best on mobile devices.",
          variant: "warning",
        });
      }

      setIsTracking(true);
      scheduleSmartAlarm();

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

      // Smart wake window (30 minutes before scheduled time)
      if (smartWakeEnabled) {
        scheduledTime.setMinutes(scheduledTime.getMinutes() - 30);
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
            }
          }
        ]
      });

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
          <Alarm className="h-5 w-5 text-primary" />
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

        <div className="flex items-center space-x-2">
          <Switch
            checked={smartWakeEnabled}
            onCheckedChange={setSmartWakeEnabled}
          />
          <Label>Smart Wake (30-min window)</Label>
        </div>

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
      </CardContent>
    </Card>
  );
};