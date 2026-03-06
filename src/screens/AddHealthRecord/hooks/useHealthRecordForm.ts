import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { LanguageContext } from '../../../context/LanguageContext';
import useImageUpload from '../../../hooks/useImageUpload';

const TYPES_WITH_DUE_DATE = ['Vaccine', 'Medication', 'Pet Groomer', 'Vet Appointment'];

export { TYPES_WITH_DUE_DATE };

export function useHealthRecordForm(record: any) {
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const [type, setType] = useState(record?.type || '');
  const [description, setDescription] = useState(record?.description || '');
  const [date, setDate] = useState(record?.date ? new Date(record.date) : new Date());
  const [image, setImage] = useState(record?.image || null);
  const [extraInfo, setExtraInfo] = useState(record?.extraInfo || '');
  const [dueDate, setDueDate] = useState<Date | null>(record?.dueDate ? new Date(record.dueDate) : null);
  const [reminder, setReminder] = useState(record?.reminder ?? false);
  const [reminderDays, setReminderDays] = useState(record?.reminderDays ?? 3);
  const [vetName, setVetName] = useState(record?.vetName || '');
  const [clinicName, setClinicName] = useState(record?.clinicName || '');
  const [visitWeight, setVisitWeight] = useState(record?.visitWeight || '');
  const [batchNumber, setBatchNumber] = useState(record?.batchNumber || '');
  const [dosage, setDosage] = useState(record?.dosage || '');
  const [frequency, setFrequency] = useState(record?.frequency || '');
  const [services, setServices] = useState(record?.services || '');

  const { pickImage, uploadImage, uploading } = useImageUpload('healthRecords');
  const hasDueDate = TYPES_WITH_DUE_DATE.includes(type);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleWeightInput = (input: string) => {
    const formatted = input.replace(/[^0-9.]/g, '');
    if (formatted.split('.').length <= 2) setVisitWeight(formatted);
  };

  const handleSave = async (isEditMode: boolean, onSuccess: () => void) => {
    if (!type || (!description && type !== 'Medication' && type !== 'Vaccine') ||
        (!extraInfo && (type === 'Medication' || type === 'Vaccine')) || !date) {
      Alert.alert(t('add.fillRequired'));
      return;
    }

    let imageUrl = image;
    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) { Alert.alert(t('common.error'), t('add.imageUploadFailed')); return; }
    }

    if (isEditMode && record?.notificationId) {
      try { await Notifications.cancelScheduledNotificationAsync(record.notificationId); } catch (_) {}
    }

    let notificationId: string | null = null;
    const shouldRemind = hasDueDate && dueDate && reminder;
    if (shouldRemind) {
      const reminderDate = new Date(dueDate.getTime() - reminderDays * 24 * 60 * 60 * 1000);
      reminderDate.setHours(9, 0, 0, 0);
      if (reminderDate.getTime() > Date.now() + 60000) {
        try {
          notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: t('notification.reminder', { type }),
              body: t('notification.body', { description: extraInfo || description || type, name: selectedDog?.name || '', count: String(reminderDays) }),
              sound: true,
            },
            trigger: { date: reminderDate },
          });
        } catch (err) { console.warn('Failed to schedule notification:', err); }
      }
    }

    const newRecord: any = {
      type, description, date: date.toISOString(), image: imageUrl,
      dogId: selectedDog!.id, extraInfo,
      dueDate: dueDate ? dueDate.toISOString() : null,
      reminder: shouldRemind || false, reminderDays: shouldRemind ? reminderDays : null,
      notificationId, vetName: vetName || null, clinicName: clinicName || null,
      visitWeight: visitWeight || null, batchNumber: batchNumber || null,
      dosage: dosage || null, frequency: frequency || null, services: services || null,
    };

    try {
      if (isEditMode) {
        await updateDoc(doc(db, 'healthRecords', record.id), newRecord);
      } else {
        await addDoc(collection(db, 'healthRecords'), newRecord);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving record', error);
      Alert.alert(t('common.error'), t('add.unableToSave'));
    }
  };

  return {
    type, setType, description, setDescription, date, setDate,
    image, extraInfo, setExtraInfo, dueDate, setDueDate,
    reminder, setReminder, reminderDays, setReminderDays,
    vetName, setVetName, clinicName, setClinicName,
    visitWeight, handleWeightInput, batchNumber, setBatchNumber,
    dosage, setDosage, frequency, setFrequency, services, setServices,
    hasDueDate, handlePickImage, handleSave, uploading, t,
  };
}
