import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from "@/integrations/supabase/client";

export class NotificationService {
  private static instance: NotificationService;
  private initialized = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    if (Capacitor.isNativePlatform()) {
      await this.initializePushNotifications();
    } else {
      await this.initializeWebNotifications();
    }

    this.initialized = true;
  }

  private async initializePushNotifications() {
    try {
      const permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        const result = await PushNotifications.requestPermissions();
        if (result.receive === 'granted') {
          await PushNotifications.register();
        }
      }

      // Listen for push notifications
      PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed:', notification);
      });
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  private async initializeWebNotifications() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Web notification permission:', permission);
    }
  }

  async scheduleNotification(options: {
    title: string;
    body: string;
    id: number;
    schedule?: { at: Date };
    data?: any;
  }) {
    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.schedule({
          notifications: [{
            title: options.title,
            body: options.body,
            id: options.id,
            schedule: options.schedule,
            extra: options.data
          }]
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        if (options.schedule) {
          const delay = options.schedule.at.getTime() - Date.now();
          if (delay > 0) {
            setTimeout(() => {
              new Notification(options.title, {
                body: options.body,
                data: options.data
              });
            }, delay);
          }
        } else {
          new Notification(options.title, {
            body: options.body,
            data: options.data
          });
        }
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async cancelNotification(id: number) {
    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.cancel({ notifications: [{ id }] });
      }
      // Web notifications can't be cancelled once shown
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }

    return data?.preferences;
  }
}

export const notificationService = NotificationService.getInstance();