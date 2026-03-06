import { useState, useContext } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { parseTimeString } from '../../../utils/timeFormatting';

const REMINDER_OPTION_KEYS = [
  { key: 'add.atTime', minutes: 0 },
  { key: 'add.15min', minutes: 15 },
  { key: 'add.1hour', minutes: 60 },
  { key: 'add.3hours', minutes: 180 },
  { key: 'add.1day', minutes: 1440 },
  { key: 'add.3days', minutes: 4320 },
];

export { REMINDER_OPTION_KEYS };

export function useScheduleForm(schedule: any, isEditMode: boolean) {
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const parsedDate = schedule?.date
    ? new Date(Date.parse(`${schedule.date}T00:00:00`))
    : new Date();
  const parsedTime = schedule?.time ? parseTimeString(schedule.time) : new Date();

  const [description, setDescription] = useState(schedule?.description || '');
  const [date, setDate] = useState(parsedDate);
  const [time, setTime] = useState(parsedTime);
  const [type, setType] = useState(schedule?.type || '');
  const [reminder, setReminder] = useState(schedule?.pushNotification || false);
  const [reminderMinutes, setReminderMinutes] = useState(schedule?.reminderMinutes ?? 60);

  const handleSave = async (onSuccess: () => void) => {
    if (!type) { Alert.alert(t('common.error'), t('alert.selectType')); return; }
    if (!description.trim()) { Alert.alert(t('common.error'), t('alert.addDescription')); return; }

    const userId = getAuth().currentUser?.uid;
    if (!userId) { Alert.alert(t('common.error'), t('alert.userNotLogged')); return; }

    const now = new Date();
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

    if (Platform.OS === 'android') {
      if (new Date(selectedDateTime.getTime() + 120000) <= now) {
        Alert.alert(t('alert.invalidDateTime'), t('alert.invalidDateTimeMsg'));
        return;
      }
    } else if (selectedDateTime <= now) {
      Alert.alert(t('alert.invalidDateTime'), t('alert.invalidDateTimeMsg'));
      return;
    }

    try {
      if (isEditMode && schedule?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(schedule.notificationId).catch(() => {});
      }

      let notificationId: string | null = null;
      if (reminder) {
        const notifyAt = new Date(selectedDateTime.getTime() - reminderMinutes * 60 * 1000);
        const reminderLabel = REMINDER_OPTION_KEYS.find((o) => o.minutes === reminderMinutes);
        const reminderText = reminderLabel ? t(reminderLabel.key) : '';
        const bodyText = reminderMinutes === 0
          ? `${t('add.atTime')}: ${description}`
          : `${description} - ${reminderText}`;

        if (notifyAt.getTime() > Date.now() + 60000) {
          notificationId = await Notifications.scheduleNotificationAsync({
            content: { title: `${type} ${t('add.reminder')}`, body: bodyText, sound: true },
            trigger: { date: notifyAt },
          });
        }
      }

      const savedTime = `${String(selectedDateTime.getHours()).padStart(2, '0')}:${String(selectedDateTime.getMinutes()).padStart(2, '0')}`;
      const scheduleData = {
        description, date: date.toLocaleDateString('en-CA'), time: savedTime,
        dogId: selectedDog!.id, userId, notificationId, type,
        emailReminder: false, pushNotification: reminder,
        reminderMinutes: reminder ? reminderMinutes : null,
      };

      if (isEditMode && schedule) {
        await updateDoc(doc(db, 'schedules', schedule.id), scheduleData);
        Alert.alert(t('common.success'), t('alert.scheduleUpdated'));
      } else {
        await addDoc(collection(db, 'schedules'), scheduleData);
        Alert.alert(t('common.success'), t('alert.scheduleSaved'));
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving schedule', error);
      Alert.alert(t('common.error'), t('alert.failedSaveSchedule'));
    }
  };

  return {
    description, setDescription, date, setDate, time, setTime,
    type, setType, reminder, setReminder, reminderMinutes, setReminderMinutes,
    handleSave, t,
  };
}
