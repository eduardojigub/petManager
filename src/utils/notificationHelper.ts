import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function isNotificationsEnabled(): Promise<boolean> {
  try {
    const saved = await AsyncStorage.getItem('notificationsEnabled');
    if (saved === null) return true;
    return JSON.parse(saved);
  } catch {
    return true;
  }
}

interface ScheduleReminderConfig {
  title: string;
  body: string;
  triggerDate: Date;
}

export async function scheduleReminder(
  config: ScheduleReminderConfig,
): Promise<string | null> {
  const enabled = await isNotificationsEnabled();
  if (!enabled) return null;

  if (config.triggerDate.getTime() <= Date.now() + 60000) return null;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: config.title,
      body: config.body,
      sound: true,
    },
    trigger: { type: SchedulableTriggerInputTypes.DATE, date: config.triggerDate },
  });

  return notificationId;
}

export async function cancelNotification(notificationId: string | null | undefined): Promise<void> {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Notification may already have fired or been cancelled
  }
}
