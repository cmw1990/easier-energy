import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export class NotificationService {
  private static instance: NotificationService;
  private initialized = false;
  private permissionGranted = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      if (Capacitor.isNativePlatform()) {
        await this.initializePushNotifications();
      } else {
        await this.initializeWebNotifications();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      throw new Error('Failed to initialize notifications');
    }
  }

  private async initializePushNotifications() {
    try {
      const permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        const result = await PushNotifications.requestPermissions();
        this.permissionGranted = result.receive === 'granted';
      } else {
        this.permissionGranted = permStatus.receive === 'granted';
      }

      if (this.permissionGranted) {
        await PushNotifications.register();
        
        // Listen for push notifications
        PushNotifications.addListener('pushNotificationReceived', notification => {
          console.log('Push notification received:', notification);
          this.showLocalNotification({
            title: notification.title || '',
            body: notification.body || '',
            id: Math.floor(Math.random() * 10000)
          });
        });

        PushNotifications.addListener('pushNotificationActionPerformed', notification => {
          console.log('Push notification action performed:', notification);
          // Handle notification action (e.g., navigate to specific screen)
        });
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      throw error;
    }
  }

  private async initializeWebNotifications() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
    }
  }

  async scheduleNotification(options: {
    title: string;
    body: string;
    id: number;
    schedule?: { at: Date };
    data?: any;
  }) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.schedule({
          notifications: [{
            title: options.title,
            body: options.body,
            id: options.id,
            schedule: options.schedule,
            extra: options.data,
            sound: options.schedule ? 'beep.wav' : undefined,
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#488AFF'
          }]
        });
      } else if (this.permissionGranted) {
        if (options.schedule) {
          const delay = options.schedule.at.getTime() - Date.now();
          if (delay > 0) {
            setTimeout(() => {
              this.showWebNotification(options);
            }, delay);
          }
        } else {
          this.showWebNotification(options);
        }
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  private showWebNotification(options: {
    title: string;
    body: string;
    data?: any;
  }) {
    const notification = new Notification(options.title, {
      body: options.body,
      data: options.data,
      icon: '/favicon.ico'
    });

    notification.onclick = () => {
      window.focus();
      if (options.data?.url) {
        window.location.href = options.data.url;
      }
    };
  }

  async cancelNotification(id: number) {
    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.cancel({ notifications: [{ id }] });
      }
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw error;
    }
  }

  async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('preferences')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data?.preferences;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId: string, preferences: any) {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async checkPermissions() {
    if (Capacitor.isNativePlatform()) {
      return await PushNotifications.checkPermissions();
    } else {
      return { receive: Notification.permission as 'granted' | 'denied' | 'prompt' };
    }
  }

  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      return await PushNotifications.requestPermissions();
    } else {
      const permission = await Notification.requestPermission();
      return { receive: permission as 'granted' | 'denied' | 'prompt' };
    }
  }
}

export const notificationService = NotificationService.getInstance();