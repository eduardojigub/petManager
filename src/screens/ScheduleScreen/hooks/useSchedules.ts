import { useState, useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { collection, query, where, getDocs, doc, deleteDoc } from '@react-native-firebase/firestore';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { confirmDelete } from '../../../utils/confirmDelete';
import { cancelNotification } from '../../../utils/notificationHelper';

export function useSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const loadSchedules = useCallback(async () => {
    if (!selectedDog) {
      setSchedules([]);
      return;
    }
    try {
      const snapshot = await getDocs(
        query(collection(db, 'schedules'), where('dogId', '==', selectedDog.id))
      );
      const loaded = snapshot.docs.map((d: any) => {
        const data = d.data();
        const [year, month, day] = data.date.split('-').map(Number);
        const timeParts = data.time.trim().split(' ');
        let [hours, minutes] = timeParts[0].split(':').map(Number);
        const modifier = timeParts[1]?.toUpperCase();
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const scheduleDateTime = new Date(year, month - 1, day, hours, minutes);
        const isPast = scheduleDateTime < new Date();
        return { id: d.id, ...data, isPast };
      });
      loaded.sort((a: any, b: any) => (a.date || '').localeCompare(b.date || ''));
      setSchedules(loaded);
    } catch (error) {
      console.error('Error loading schedules', error);
    }
  }, [selectedDog]);

  const handleDelete = (scheduleId: string, notificationId: string) => {
    confirmDelete({
      title: t('alert.deleteSchedule'),
      message: t('alert.deleteScheduleMsg'),
      onConfirm: async () => {
        try {
          await cancelNotification(notificationId);
          await deleteDoc(doc(db, 'schedules', scheduleId));
          setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
          Alert.alert(t('common.success'), t('alert.scheduleDeleted'));
        } catch (error) {
          console.error('Error deleting schedule', error);
          Alert.alert(t('common.error'), t('alert.failedDeleteSchedule'));
        }
      },
    });
  };

  const handleDeleteAll = () => {
    if (schedules.length === 0) return;
    Alert.alert(
      t('alert.deleteAllSchedules'),
      t('alert.deleteAllSchedulesMsg', { count: String(schedules.length), name: selectedDog?.name || '' }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.deleteAll'),
          style: 'destructive',
          onPress: async () => {
            try {
              const results = await Promise.allSettled(
                schedules.map(async (s) => {
                  await cancelNotification(s.notificationId);
                  await deleteDoc(doc(db, 'schedules', s.id));
                })
              );
              const failures = results.filter((r) => r.status === 'rejected');
              if (failures.length > 0) {
                loadSchedules();
                Alert.alert(t('common.error'), t('alert.someDeletesFailed'));
              } else {
                setSchedules([]);
                Alert.alert(t('common.success'), t('alert.allSchedulesDeleted'));
              }
            } catch (error) {
              console.error('Error deleting all schedules', error);
              Alert.alert(t('common.error'), t('alert.failedDeleteAllSchedules'));
            }
          },
        },
      ]
    );
  };

  return { schedules, loadSchedules, handleDelete, handleDeleteAll };
}
