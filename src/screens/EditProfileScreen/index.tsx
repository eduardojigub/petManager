import React, { useContext, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
} from 'react-native';
import { db } from '../../firebase/Firestore';
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs } from '@react-native-firebase/firestore';
import * as Notifications from 'expo-notifications';
import { getAuth } from '@react-native-firebase/auth';
import {
  ScrollContainer,
  ContentContainer,
  AvatarContainer,
  AvatarImage,
  AvatarPlaceholder,
  CameraIconBadge,
  FormCard,
  FormTitle,
  InputGroup,
  InputLabel,
  InputWithIcon,
  IconInput,
  UnitText,
  GenderRow,
  GenderChip,
  GenderChipText,
  DatePickerButton,
  DatePickerText,
  AgeDisplay,
  OptionalBadge,
  SaveButton,
  ButtonText,
  DeleteButton,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { LanguageContext } from '../../context/LanguageContext';
import { Dog, PawPrint, Scales, Camera, GenderMale, GenderFemale, CalendarBlank, Palette, Barcode } from 'phosphor-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useImageUpload from '../../hooks/useImageUpload';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../types/navigation';
import { confirmDelete } from '../../utils/confirmDelete';
import DatePickerField from '../../components/DatePickerField';

type Props = StackScreenProps<ProfileStackParamList, 'EditProfile'>;

function calculateAge(birthday: Date, t: (key: string, params?: Record<string, string>) => string): string {
  const now = new Date();
  let years = now.getFullYear() - birthday.getFullYear();
  let months = now.getMonth() - birthday.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (now.getDate() < birthday.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  if (years === 0) {
    return t('editPet.ageMonthsOld', { count: String(months) });
  }
  if (months === 0) {
    return t('editPet.ageYearsOld', { count: String(years) });
  }
  return t('editPet.ageYearsMonthsOld', { years: String(years), months: String(months) });
}

function ageToDecimal(birthday: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - birthday.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return years.toFixed(1);
}

export default function EditProfileScreen({ navigation, route }: Props) {
  const {
    id,
    name: initialName,
    breed: initialBreed,
    age: initialAge,
    weight: initialWeight,
    image: initialImage,
    birthday: initialBirthday,
    gender: initialGender,
    color: initialColor,
    microchip: initialMicrochip,
  } = route.params || {};
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

  const handleSave = async () => {
    const userId = getAuth().currentUser?.uid;

    if (!userId || !name || !breed || !birthday || !weight) {
      Alert.alert(t('common.error'), t('editPet.requiredFields'));
      return;
    }

    let imageUrl = image;

    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        Alert.alert(t('common.error'), t('editPet.imageUploadFailed'));
        return;
      }
    }

    const age = ageToDecimal(birthday);
    const profile = {
      name,
      breed,
      age,
      weight,
      image: imageUrl,
      userId,
      birthday: birthday.toISOString().split('T')[0],
      gender: gender || null,
      color: color || null,
      microchip: microchip || null,
    };

    try {
      if (isNewProfile) {
        await addDoc(collection(db, 'dogProfiles'), profile);
      } else {
        await updateDoc(doc(db, 'dogProfiles', id), profile);
      }

      navigation.navigate('Profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert(t('common.error'), t('editPet.failedSave'));
    }
  };

  const handleDelete = () => {
    confirmDelete({
      title: t('editPet.deleteConfirmTitle'),
      message: t('editPet.deleteConfirmMsg'),
      confirmText: t('common.ok'),
      destructive: false,
      cancelable: false,
      onConfirm: async () => {
        try {
          // Cancel all notifications for this dog's schedules and health records
          const [schedulesSnap, recordsSnap] = await Promise.all([
            getDocs(query(collection(db, 'schedules'), where('dogId', '==', id))),
            getDocs(query(collection(db, 'healthRecords'), where('dogId', '==', id))),
          ]);

          const cancelAndDelete = async (snap: any, collectionName: string) => {
            await Promise.allSettled(
              snap.docs.map(async (d: any) => {
                const data = d.data();
                if (data.notificationId) {
                  await Notifications.cancelScheduledNotificationAsync(data.notificationId).catch(() => {});
                }
                await deleteDoc(doc(db, collectionName, d.id));
              })
            );
          };

          await Promise.all([
            cancelAndDelete(schedulesSnap, 'schedules'),
            cancelAndDelete(recordsSnap, 'healthRecords'),
          ]);

          await deleteDoc(doc(db, 'dogProfiles', id));
          setSelectedDog(null);
          Alert.alert(t('editPet.profileDeleted'), t('editPet.profileDeletedMsg'));
          navigation.navigate('Profile');
        } catch (error) {
          console.error('Failed to delete profile:', error);
          Alert.alert(t('common.error'), t('editPet.failedDelete'));
        }
      },
    });
  };

  const handleWeightInput = (input: string) => {
    const formatted = input.replace(/[^0-9.]/g, '');
    if (formatted.split('.').length <= 2) {
      setWeight(formatted);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollContainer>
          <ContentContainer>
            <AvatarContainer onPress={handlePickImage}>
              {image ? (
                <AvatarImage source={{ uri: image }} />
              ) : (
                <AvatarPlaceholder>
                  <Icon name="dog" size={44} color="#41245c" />
                </AvatarPlaceholder>
              )}
              <CameraIconBadge>
                <Camera size={16} color="#fff" weight="bold" />
              </CameraIconBadge>
            </AvatarContainer>

            <FormCard>
              <FormTitle>
                {isNewProfile ? t('editPet.addNew') : t('editPet.editProfile')}
              </FormTitle>

              <InputGroup>
                <InputLabel>{t('editPet.name')}</InputLabel>
                <InputWithIcon>
                  <Dog size={22} color="#41245c" />
                  <IconInput
                    value={name}
                    onChangeText={setName}
                    placeholder={t('editPet.namePlaceholder')}
                    placeholderTextColor="#ccc"
                    maxLength={20}
                    returnKeyType="done"
                    blurOnSubmit
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </InputWithIcon>
              </InputGroup>

              <InputGroup>
                <InputLabel>{t('editPet.breed')}</InputLabel>
                <InputWithIcon>
                  <PawPrint size={22} color="#41245c" />
                  <IconInput
                    value={breed}
                    onChangeText={setBreed}
                    placeholder={t('editPet.breedPlaceholder')}
                    placeholderTextColor="#ccc"
                    returnKeyType="done"
                    blurOnSubmit
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </InputWithIcon>
              </InputGroup>

              <InputGroup>
                <InputLabel>{t('editPet.gender')}</InputLabel>
                <GenderRow>
                  <GenderChip
                    selected={gender === 'Male'}
                    onPress={() => setGender(gender === 'Male' ? '' : 'Male')}
                  >
                    <GenderMale
                      size={20}
                      color={gender === 'Male' ? '#fff' : '#999'}
                      weight="bold"
                    />
                    <GenderChipText selected={gender === 'Male'}>{t('editPet.male')}</GenderChipText>
                  </GenderChip>
                  <GenderChip
                    selected={gender === 'Female'}
                    onPress={() => setGender(gender === 'Female' ? '' : 'Female')}
                  >
                    <GenderFemale
                      size={20}
                      color={gender === 'Female' ? '#fff' : '#999'}
                      weight="bold"
                    />
                    <GenderChipText selected={gender === 'Female'}>{t('editPet.female')}</GenderChipText>
                  </GenderChip>
                </GenderRow>
              </InputGroup>

              <InputGroup>
                <InputLabel>{t('editPet.birthday')}</InputLabel>
                <DatePickerField
                  value={birthday || new Date()}
                  onChange={(date) => setBirthday(date)}
                  mode="date"
                  label={t('editPet.selectBirthday')}
                  renderButton={(onPress, displayText) => (
                    <DatePickerButton onPress={onPress}>
                      <CalendarBlank size={22} color="#41245c" />
                      <DatePickerText hasValue={!!birthday}>
                        {birthday ? displayText : t('editPet.selectDateOfBirth')}
                      </DatePickerText>
                    </DatePickerButton>
                  )}
                />
                {birthday && <AgeDisplay>{calculateAge(birthday, t)}</AgeDisplay>}
              </InputGroup>

              <InputGroup>
                <InputLabel>{t('editPet.weight')}</InputLabel>
                <InputWithIcon>
                  <Scales size={22} color="#41245c" />
                  <IconInput
                    value={weight}
                    onChangeText={handleWeightInput}
                    placeholder={t('editPet.weightPlaceholder')}
                    placeholderTextColor="#ccc"
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    blurOnSubmit
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  <UnitText>kg</UnitText>
                </InputWithIcon>
              </InputGroup>

              <InputGroup>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <InputLabel>{t('editPet.colorCoat')}</InputLabel>
                  <OptionalBadge>{t('editPet.optional')}</OptionalBadge>
                </View>
                <InputWithIcon>
                  <Palette size={22} color="#41245c" />
                  <IconInput
                    value={color}
                    onChangeText={setColor}
                    placeholder={t('editPet.colorPlaceholder')}
                    placeholderTextColor="#ccc"
                    returnKeyType="done"
                    blurOnSubmit
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </InputWithIcon>
              </InputGroup>

              <InputGroup>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <InputLabel>{t('editPet.microchip')}</InputLabel>
                  <OptionalBadge>{t('editPet.optional')}</OptionalBadge>
                </View>
                <InputWithIcon>
                  <Barcode size={22} color="#41245c" />
                  <IconInput
                    value={microchip}
                    onChangeText={setMicrochip}
                    placeholder={t('editPet.microchipPlaceholder')}
                    placeholderTextColor="#ccc"
                    returnKeyType="done"
                    blurOnSubmit
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </InputWithIcon>
              </InputGroup>
            </FormCard>

            <SaveButton onPress={handleSave} disabled={uploading}>
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ButtonText>
                  {isNewProfile ? t('editPet.createProfile') : t('editPet.saveChanges')}
                </ButtonText>
              )}
            </SaveButton>

            {!isNewProfile && (
              <DeleteButton onPress={handleDelete}>
                <ButtonText>{t('editPet.deleteProfile')}</ButtonText>
              </DeleteButton>
            )}
          </ContentContainer>
        </ScrollContainer>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
