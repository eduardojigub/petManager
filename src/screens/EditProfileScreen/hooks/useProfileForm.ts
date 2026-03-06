import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { collection, addDoc, doc, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { LanguageContext } from '../../../context/LanguageContext';
import useImageUpload from '../../../hooks/useImageUpload';
import { confirmDelete } from '../../../utils/confirmDelete';

function ageToDecimal(birthday: Date): string {
  const diffMs = new Date().getTime() - birthday.getTime();
  return (diffMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
}

function calculateAge(birthday: Date, t: (key: string, params?: Record<string, string>) => string): string {
  const now = new Date();
  let years = now.getFullYear() - birthday.getFullYear();
  let months = now.getMonth() - birthday.getMonth();
  if (months < 0) { years--; months += 12; }
  if (now.getDate() < birthday.getDate()) { months--; if (months < 0) { years--; months += 12; } }
  if (years === 0) return t('editPet.ageMonthsOld', { count: String(months) });
  if (months === 0) return t('editPet.ageYearsOld', { count: String(years) });
  return t('editPet.ageYearsMonthsOld', { years: String(years), months: String(months) });
}

export function useProfileForm(params: any) {
  const { id, name: initialName, breed: initialBreed, weight: initialWeight,
    image: initialImage, birthday: initialBirthday, gender: initialGender,
    color: initialColor, microchip: initialMicrochip } = params || {};
  const isNewProfile = !id;
  const { setSelectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const [name, setName] = useState(initialName || '');
  const [breed, setBreed] = useState(initialBreed || '');
  const [weight, setWeight] = useState(initialWeight || '');
  const [image, setImage] = useState(initialImage || null);
  const [gender, setGender] = useState(initialGender || '');
  const [color, setColor] = useState(initialColor || '');
  const [microchip, setMicrochip] = useState(initialMicrochip || '');
  const [birthday, setBirthday] = useState<Date | null>(
    initialBirthday ? new Date(initialBirthday) : null
  );
  const { pickImage, uploadImage, uploading } = useImageUpload('dogProfiles', { resize: true });

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleWeightInput = (input: string) => {
    const formatted = input.replace(/[^0-9.]/g, '');
    if (formatted.split('.').length <= 2) setWeight(formatted);
  };

  const handleSave = async (onSuccess: () => void) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId || !name || !breed || !birthday || !weight) {
      Alert.alert(t('common.error'), t('editPet.requiredFields'));
      return;
    }

    let imageUrl = image;
    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) { Alert.alert(t('common.error'), t('editPet.imageUploadFailed')); return; }
    }

    const profile = {
      name, breed, age: ageToDecimal(birthday), weight, image: imageUrl,
      userId, birthday: birthday.toISOString().split('T')[0],
      gender: gender || null, color: color || null, microchip: microchip || null,
    };

    try {
      if (isNewProfile) {
        await addDoc(collection(db, 'dogProfiles'), profile);
      } else {
        await updateDoc(doc(db, 'dogProfiles', id), profile);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert(t('common.error'), t('editPet.failedSave'));
    }
  };

  const handleDelete = (onSuccess: () => void) => {
    confirmDelete({
      title: t('editPet.deleteConfirmTitle'),
      message: t('editPet.deleteConfirmMsg'),
      confirmText: t('common.ok'),
      destructive: false,
      cancelable: false,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'dogProfiles', id));
          setSelectedDog(null);
          Alert.alert(t('editPet.profileDeleted'), t('editPet.profileDeletedMsg'));
          onSuccess();
        } catch (error) {
          console.error('Failed to delete profile:', error);
          Alert.alert(t('common.error'), t('editPet.failedDelete'));
        }
      },
    });
  };

  return {
    name, setName, breed, setBreed, weight, handleWeightInput,
    image, handlePickImage, gender, setGender, color, setColor,
    microchip, setMicrochip, birthday, setBirthday,
    isNewProfile, uploading, handleSave, handleDelete,
    calculateAge, t,
  };
}
