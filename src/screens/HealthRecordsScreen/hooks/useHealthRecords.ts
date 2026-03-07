import { useState, useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { collection, query, where, getDocs, doc, deleteDoc } from '@react-native-firebase/firestore';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { confirmDelete } from '../../../utils/confirmDelete';
import { cancelNotification } from '../../../utils/notificationHelper';

export function useHealthRecords() {
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const loadRecords = useCallback(async () => {
    if (!selectedDog) {
      setHealthRecords([]);
      return;
    }
    setIsLoading(true);
    try {
      const snapshot = await getDocs(
        query(collection(db, 'healthRecords'), where('dogId', '==', selectedDog.id))
      );
      const records = snapshot.docs.map((d: any) => ({
        id: d.id,
        ...d.data(),
      }));
      records.sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
      setHealthRecords(records);
    } catch (error) {
      console.error('Error loading health records', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDog]);

  const handleConfirmDelete = (id: string) => {
    confirmDelete({
      title: t('alert.deleteRecord'),
      message: t('alert.deleteRecordMsg'),
      onConfirm: async () => {
        try {
          const record = healthRecords.find((r) => r.id === id);
          await cancelNotification(record?.notificationId);
          await deleteDoc(doc(db, 'healthRecords', id));
          setHealthRecords((prev) => prev.filter((r) => r.id !== id));
          Alert.alert(t('common.success'), t('alert.recordDeleted'));
        } catch (error) {
          console.error('Error deleting health record', error);
          Alert.alert(t('common.error'), t('alert.failedDeleteRecord'));
        }
      },
    });
  };

  const handleDeleteAll = () => {
    if (healthRecords.length === 0) return;
    Alert.alert(
      t('alert.deleteAllRecords'),
      t('alert.deleteAllRecordsMsg', { count: String(healthRecords.length), name: selectedDog?.name || '' }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.deleteAll'),
          style: 'destructive',
          onPress: async () => {
            try {
              const results = await Promise.allSettled(
                healthRecords.map(async (r) => {
                  await cancelNotification(r.notificationId);
                  await deleteDoc(doc(db, 'healthRecords', r.id));
                })
              );
              const failures = results.filter((r) => r.status === 'rejected');
              if (failures.length > 0) {
                loadRecords();
                Alert.alert(t('common.error'), t('alert.someDeletesFailed'));
              } else {
                setHealthRecords([]);
                Alert.alert(t('common.success'), t('alert.allRecordsDeleted'));
              }
            } catch (error) {
              console.error('Error deleting all records', error);
              Alert.alert(t('common.error'), t('alert.failedDeleteAllRecords'));
            }
          },
        },
      ]
    );
  };

  const totalRecords = healthRecords.length;
  const vaccineCount = healthRecords.filter((r) => r.type === 'Vaccine').length;
  const vetVisitCount = healthRecords.filter((r) => r.type === 'Vet Appointment').length;
  const scheduledCount = healthRecords.filter((r) => r.status === 'scheduled').length;
  const completedCount = healthRecords.filter((r) => r.status !== 'scheduled').length;

  return {
    healthRecords,
    isLoading,
    loadRecords,
    handleConfirmDelete,
    handleDeleteAll,
    stats: { totalRecords, vaccineCount, vetVisitCount, scheduledCount, completedCount },
  };
}
