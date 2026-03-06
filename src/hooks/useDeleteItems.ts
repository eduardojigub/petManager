import { Alert } from 'react-native';
import { deleteDoc, doc } from '@react-native-firebase/firestore';
import { db } from '../firebase/Firestore';
import { confirmDelete } from '../utils/confirmDelete';
import { cancelNotification } from '../utils/notificationHelper';

type TranslateFn = (key: string, params?: Record<string, string>) => string;

interface DeleteSingleConfig {
  collectionName: string;
  id: string;
  notificationId?: string | null;
  onSuccess: () => void;
  t: TranslateFn;
  confirmTitle: string;
  confirmMessage: string;
  successMessage: string;
  errorMessage: string;
}

export function deleteSingle(config: DeleteSingleConfig) {
  confirmDelete({
    title: config.confirmTitle,
    message: config.confirmMessage,
    onConfirm: async () => {
      try {
        await cancelNotification(config.notificationId);
        await deleteDoc(doc(db, config.collectionName, config.id));
        config.onSuccess();
        Alert.alert(config.t('common.success'), config.successMessage);
      } catch (error) {
        console.error(`Error deleting from ${config.collectionName}`, error);
        Alert.alert(config.t('common.error'), config.errorMessage);
      }
    },
  });
}

interface DeleteAllConfig<T extends { id: string; notificationId?: string | null }> {
  items: T[];
  collectionName: string;
  onSuccess: () => void;
  t: TranslateFn;
  confirmTitle: string;
  confirmMessage: string;
  successMessage: string;
  errorMessage: string;
}

export function deleteAll<T extends { id: string; notificationId?: string | null }>(
  config: DeleteAllConfig<T>,
) {
  if (config.items.length === 0) return;

  Alert.alert(
    config.confirmTitle,
    config.confirmMessage,
    [
      { text: config.t('common.cancel'), style: 'cancel' },
      {
        text: config.t('common.deleteAll'),
        style: 'destructive',
        onPress: async () => {
          try {
            const results = await Promise.allSettled(
              config.items.map(async (item) => {
                await cancelNotification(item.notificationId);
                await deleteDoc(doc(db, config.collectionName, item.id));
              })
            );

            const failures = results.filter((r) => r.status === 'rejected');
            if (failures.length > 0) {
              Alert.alert(config.t('common.error'), config.t('alert.someDeletesFailed'));
            } else {
              config.onSuccess();
              Alert.alert(config.t('common.success'), config.successMessage);
            }
          } catch (error) {
            console.error(`Error deleting all from ${config.collectionName}`, error);
            Alert.alert(config.t('common.error'), config.errorMessage);
          }
        },
      },
    ]
  );
}
