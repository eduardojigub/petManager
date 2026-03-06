import React, { useContext, useState } from 'react';
import {
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Switch,
} from 'react-native';
import {
  KeyboardAvoidingContainer,
  Container,
  ContentContainer,
  SectionTitle,
  TypeGrid,
  TypeChip,
  TypeChipText,
  FormCard,
  InputGroup,
  InputLabel,
  InputWithIcon,
  StyledInput,
  MultilineInput,
  DateButton,
  DateButtonText,
  ImageSection,
  ImagePreview,
  ImageButton,
  ImageButtonText,
  ReminderRow,
  ReminderLabel,
  ReminderDaysRow,
  ReminderDayChip,
  ReminderDayText,
  OptionalBadge,
  LabelRow,
  SaveButton,
  SaveButtonText,
  PlaceholderContainer,
  PlaceholderText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import {
  Question,
  CalendarBlank,
  Camera,
  Pill,
  Bell,
  Stethoscope,
  Scales,
  Scissors,
  Barcode,
  FirstAid,
} from 'phosphor-react-native';
import * as Notifications from 'expo-notifications';
import useImageUpload from '../../hooks/useImageUpload';
import DatePickerField from '../../components/DatePickerField';
import { StackScreenProps } from '@react-navigation/stack';
import { HealthStackParamList } from '../../types/navigation';
import { HEALTH_SCHEDULE_TYPES } from '../../constants/typeOptions';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { LanguageContext } from '../../context/LanguageContext';

type Props = StackScreenProps<HealthStackParamList, 'AddHealthRecord'>;

const TYPE_COLOR: Record<string, string> = {
  Vaccine: '#27ae60',
  'Vet Appointment': '#3498db',
  Medication: '#e67e22',
  'Pet Groomer': '#e91e63',
  Other: '#9b59b6',
};

const TYPE_BG: Record<string, string> = {
  Vaccine: '#e8f5e9',
  'Vet Appointment': '#e3f2fd',
  Medication: '#fff3e0',
  'Pet Groomer': '#fce4ec',
  Other: '#f3e5f5',
};

const TYPES_WITH_DUE_DATE = ['Vaccine', 'Medication', 'Pet Groomer', 'Vet Appointment'];

export default function AddHealthRecordScreen({ navigation, route }: Props) {
  const { record } = route.params;

  const [type, setType] = useState(record?.type || '');
  const [description, setDescription] = useState(record?.description || '');
  const [date, setDate] = useState(record?.date ? new Date(record.date) : new Date());
  const [image, setImage] = useState(record?.image || null);
  const [extraInfo, setExtraInfo] = useState(record?.extraInfo || '');
  const [dueDate, setDueDate] = useState<Date | null>(
    record?.dueDate ? new Date(record.dueDate) : null
  );
  const [reminder, setReminder] = useState(record?.reminder ?? false);
  const [reminderDays, setReminderDays] = useState(record?.reminderDays ?? 3);

  // Vet Appointment optional fields
  const [vetName, setVetName] = useState(record?.vetName || '');
  const [clinicName, setClinicName] = useState(record?.clinicName || '');
  const [visitWeight, setVisitWeight] = useState(record?.visitWeight || '');

  // Vaccine optional field
  const [batchNumber, setBatchNumber] = useState(record?.batchNumber || '');

  // Medication optional fields
  const [dosage, setDosage] = useState(record?.dosage || '');
  const [frequency, setFrequency] = useState(record?.frequency || '');

  // Pet Groomer optional field
  const [services, setServices] = useState(record?.services || '');

  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const getDueDateLabel = (type: string): string => {
    const map: Record<string, string> = {
      Vaccine: t('add.nextDoseDue'),
      Medication: t('add.endDate'),
      'Pet Groomer': t('add.nextAppointment'),
      'Vet Appointment': t('add.nextVisit'),
    };
    return map[type] || t('add.dueDate');
  };

  const getDueDatePlaceholder = (type: string): string => {
    const map: Record<string, string> = {
      Vaccine: t('add.whenNextDose'),
      Medication: t('add.whenMedEnds'),
      'Pet Groomer': t('add.whenNextGrooming'),
      'Vet Appointment': t('add.whenNextVisit'),
    };
    return map[type] || t('add.selectDueDate');
  };
  const { pickImage, uploadImage, uploading } = useImageUpload('healthRecords');

  const hasDueDate = TYPES_WITH_DUE_DATE.includes(type);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleWeightInput = (input: string) => {
    const formatted = input.replace(/[^0-9.]/g, '');
    if (formatted.split('.').length <= 2) {
      setVisitWeight(formatted);
    }
  };

  const handleSave = async () => {
    if (
      !type ||
      (!description && type !== 'Medication' && type !== 'Vaccine') ||
      (!extraInfo && (type === 'Medication' || type === 'Vaccine')) ||
      !date
    ) {
      Alert.alert(t('add.fillRequired'));
      return;
    }

    let imageUrl = image;
    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        Alert.alert(t('common.error'), t('add.imageUploadFailed'));
        return;
      }
    }

    // Cancel existing notification if editing
    if (route.params?.isEditMode && record?.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(record.notificationId);
      } catch (_) {}
    }

    // Schedule notification if reminder is enabled
    let notificationId: string | null = null;
    const shouldRemind = hasDueDate && dueDate && reminder;
    if (shouldRemind) {
      const reminderDate = new Date(dueDate.getTime() - reminderDays * 24 * 60 * 60 * 1000);
      reminderDate.setHours(9, 0, 0, 0); // notify at 9 AM

      // Only schedule if the reminder date is at least 1 minute in the future
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
        } catch (err) {
          console.warn('Failed to schedule notification:', err);
        }
      }
    }

    const newRecord: any = {
      type,
      description,
      date: date.toISOString(),
      image: imageUrl,
      dogId: selectedDog.id,
      extraInfo,
      dueDate: dueDate ? dueDate.toISOString() : null,
      reminder: shouldRemind || false,
      reminderDays: shouldRemind ? reminderDays : null,
      notificationId,
      vetName: vetName || null,
      clinicName: clinicName || null,
      visitWeight: visitWeight || null,
      batchNumber: batchNumber || null,
      dosage: dosage || null,
      frequency: frequency || null,
      services: services || null,
    };

    try {
      if (route.params?.isEditMode) {
        await updateDoc(doc(db, 'healthRecords', record.id), newRecord);
        if (route.params?.onGoBack) route.params.onGoBack();
        navigation.navigate('HealthRecords');
      } else {
        await addDoc(collection(db, 'healthRecords'), newRecord);
        if (route.params?.addRecord) route.params.addRecord(newRecord);
        if (route.params?.onGoBack) route.params.onGoBack();
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving record', error);
      Alert.alert(t('common.error'), t('add.unableToSave'));
    }
  };

  return (
    <KeyboardAvoidingContainer
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <ContentContainer>
            <SectionTitle>{t('add.selectType')}</SectionTitle>
            <TypeGrid>
              {HEALTH_SCHEDULE_TYPES.map((item) => {
                const isSelected = type === item.label;
                const color = TYPE_COLOR[item.label] || '#41245c';
                const bg = TYPE_BG[item.label] || '#f0eff4';
                return (
                  <TypeChip
                    key={item.label}
                    selected={isSelected}
                    selectedBg={bg}
                    onPress={() => setType(item.label)}
                  >
                    {getHealthScheduleIcon(item.label, 20, color)}
                    <TypeChipText selected={isSelected} selectedColor={color}>
                      {item.label}
                    </TypeChipText>
                  </TypeChip>
                );
              })}
            </TypeGrid>

            {!type && (
              <PlaceholderContainer>
                <Question size={40} color="#ccc" />
                <PlaceholderText>
                  {t('add.selectTypePlaceholder')}
                </PlaceholderText>
              </PlaceholderContainer>
            )}

            {type && (
              <>
                <FormCard>
                  {/* Vaccine: name + batch */}
                  {type === 'Vaccine' && (
                    <>
                      <InputGroup>
                        <InputLabel>{t('add.vaccineName')}</InputLabel>
                        <InputWithIcon>
                          <Pill size={20} color="#27ae60" />
                          <StyledInput
                            value={extraInfo}
                            onChangeText={setExtraInfo}
                            placeholder={t('add.vaccineNamePlaceholder')}
                            placeholderTextColor="#ccc"
                            returnKeyType="done"
                            blurOnSubmit
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </InputWithIcon>
                      </InputGroup>
                      <InputGroup>
                        <LabelRow>
                          <InputLabel>{t('add.batchNumber')}</InputLabel>
                          <OptionalBadge>{t('add.optional')}</OptionalBadge>
                        </LabelRow>
                        <InputWithIcon>
                          <Barcode size={20} color="#41245c" />
                          <StyledInput
                            value={batchNumber}
                            onChangeText={setBatchNumber}
                            placeholder={t('add.batchNumberPlaceholder')}
                            placeholderTextColor="#ccc"
                            returnKeyType="done"
                            blurOnSubmit
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </InputWithIcon>
                      </InputGroup>
                    </>
                  )}

                  {/* Medication: name + dosage + frequency */}
                  {type === 'Medication' && (
                    <>
                      <InputGroup>
                        <InputLabel>{t('add.medicationName')}</InputLabel>
                        <InputWithIcon>
                          <Pill size={20} color="#e67e22" />
                          <StyledInput
                            value={extraInfo}
                            onChangeText={setExtraInfo}
                            placeholder={t('add.medicationNamePlaceholder')}
                            placeholderTextColor="#ccc"
                            returnKeyType="done"
                            blurOnSubmit
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </InputWithIcon>
                      </InputGroup>
                      <InputGroup>
                        <LabelRow>
                          <InputLabel>{t('add.dosage')}</InputLabel>
                          <OptionalBadge>{t('add.optional')}</OptionalBadge>
                        </LabelRow>
                        <InputWithIcon>
                          <FirstAid size={20} color="#41245c" />
                          <StyledInput
                            value={dosage}
                            onChangeText={setDosage}
                            placeholder={t('add.dosagePlaceholder')}
                            placeholderTextColor="#ccc"
                            returnKeyType="done"
                            blurOnSubmit
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </InputWithIcon>
                      </InputGroup>
                      <InputGroup>
                        <LabelRow>
                          <InputLabel>{t('add.frequency')}</InputLabel>
                          <OptionalBadge>{t('add.optional')}</OptionalBadge>
                        </LabelRow>
                        <InputWithIcon>
                          <CalendarBlank size={20} color="#41245c" />
                          <StyledInput
                            value={frequency}
                            onChangeText={setFrequency}
                            placeholder={t('add.frequencyPlaceholder')}
                            placeholderTextColor="#ccc"
                            returnKeyType="done"
                            blurOnSubmit
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </InputWithIcon>
                      </InputGroup>
                    </>
                  )}

                  {/* Vet Appointment: vet name + clinic + weight */}
                  {type === 'Vet Appointment' && (
                    <>
                      <InputGroup>
                        <LabelRow>
                          <InputLabel>{t('add.vetName')}</InputLabel>
                          <OptionalBadge>{t('add.optional')}</OptionalBadge>
                        </LabelRow>
                        <InputWithIcon>
                          <Stethoscope size={20} color="#3498db" />
                          <StyledInput
                            value={vetName}
                            onChangeText={setVetName}
                            placeholder={t('add.vetNamePlaceholder')}
                            placeholderTextColor="#ccc"
                            returnKeyType="done"
                            blurOnSubmit
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </InputWithIcon>
                      </InputGroup>
                      <InputGroup>
                        <LabelRow>
                          <InputLabel>{t('add.clinic')}</InputLabel>
                          <OptionalBadge>{t('add.optional')}</OptionalBadge>
                        </LabelRow>
                        <InputWithIcon>
                          <FirstAid size={20} color="#41245c" />
                          <StyledInput
                            value={clinicName}
                            onChangeText={setClinicName}
                            placeholder={t('add.clinicPlaceholder')}
                            placeholderTextColor="#ccc"
                            returnKeyType="done"
                            blurOnSubmit
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </InputWithIcon>
                      </InputGroup>
                      <InputGroup>
                        <LabelRow>
                          <InputLabel>{t('add.weightAtVisit')}</InputLabel>
                          <OptionalBadge>{t('add.optional')}</OptionalBadge>
                        </LabelRow>
                        <InputWithIcon>
                          <Scales size={20} color="#41245c" />
                          <StyledInput
                            value={visitWeight}
                            onChangeText={handleWeightInput}
                            placeholder={t('add.weightPlaceholder')}
                            placeholderTextColor="#ccc"
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                            blurOnSubmit
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </InputWithIcon>
                      </InputGroup>
                    </>
                  )}

                  {/* Pet Groomer: services */}
                  {type === 'Pet Groomer' && (
                    <InputGroup>
                      <LabelRow>
                        <InputLabel>{t('add.services')}</InputLabel>
                        <OptionalBadge>{t('add.optional')}</OptionalBadge>
                      </LabelRow>
                      <InputWithIcon>
                        <Scissors size={20} color="#e91e63" />
                        <StyledInput
                          value={services}
                          onChangeText={setServices}
                          placeholder={t('add.servicesPlaceholder')}
                          placeholderTextColor="#ccc"
                          returnKeyType="done"
                          blurOnSubmit
                          onSubmitEditing={Keyboard.dismiss}
                        />
                      </InputWithIcon>
                    </InputGroup>
                  )}

                  {/* Common: details */}
                  <InputGroup>
                    <InputLabel>{t('add.details')}</InputLabel>
                    <MultilineInput
                      value={description}
                      onChangeText={setDescription}
                      placeholder={t('add.detailsPlaceholder')}
                      placeholderTextColor="#ccc"
                      multiline
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </InputGroup>

                  {/* Common: date */}
                  <InputGroup>
                    <InputLabel>{t('add.date')}</InputLabel>
                    <DatePickerField
                      value={date}
                      onChange={setDate}
                      mode="date"
                      label={t('add.selectDate')}
                      renderButton={(onPress, displayText) => (
                        <DateButton onPress={onPress}>
                          <CalendarBlank size={20} color="#41245c" />
                          <DateButtonText hasValue>{displayText}</DateButtonText>
                        </DateButton>
                      )}
                    />
                  </InputGroup>

                  {/* Due date + reminder */}
                  {hasDueDate && (
                    <>
                      <InputGroup>
                        <LabelRow>
                          <InputLabel>{getDueDateLabel(type)}</InputLabel>
                          <OptionalBadge>{t('add.optional')}</OptionalBadge>
                        </LabelRow>
                        <DatePickerField
                          value={dueDate || new Date()}
                          onChange={(d) => setDueDate(d)}
                          mode="date"
                          label={getDueDatePlaceholder(type)}
                          renderButton={(onPress, displayText) => (
                            <DateButton onPress={onPress}>
                              <CalendarBlank size={20} color="#e67e22" />
                              <DateButtonText hasValue={!!dueDate}>
                                {dueDate ? displayText : getDueDatePlaceholder(type)}
                              </DateButtonText>
                            </DateButton>
                          )}
                        />
                      </InputGroup>

                      {dueDate && (
                        <InputGroup>
                          <InputLabel>{t('add.reminder')}</InputLabel>
                          <ReminderRow>
                            <Bell size={20} color="#41245c" />
                            <ReminderLabel>{t('add.remindBeforeExpires')}</ReminderLabel>
                            <Switch
                              value={reminder}
                              onValueChange={setReminder}
                              trackColor={{ false: '#ddd', true: '#7289da' }}
                              thumbColor={reminder ? '#41245c' : '#f4f3f4'}
                            />
                          </ReminderRow>
                          {reminder && (
                            <>
                              <InputLabel style={{ marginTop: 10 }}>{t('add.howManyDaysBefore')}</InputLabel>
                              <ReminderDaysRow>
                                {[1, 3, 7, 14, 30].map((days) => (
                                  <ReminderDayChip
                                    key={days}
                                    selected={reminderDays === days}
                                    onPress={() => setReminderDays(days)}
                                  >
                                    <ReminderDayText selected={reminderDays === days}>
                                      {days === 1 ? t('add.1dayChip') : t('add.daysChip', { count: String(days) })}
                                    </ReminderDayText>
                                  </ReminderDayChip>
                                ))}
                              </ReminderDaysRow>
                            </>
                          )}
                        </InputGroup>
                      )}
                    </>
                  )}

                  {/* Image */}
                  <ImageSection>
                    {image && <ImagePreview source={{ uri: image }} />}
                    <ImageButton onPress={handlePickImage}>
                      <Camera size={20} color="#41245c" />
                      <ImageButtonText>
                        {image ? t('add.changeImage') : t('add.addImage')}
                      </ImageButtonText>
                    </ImageButton>
                  </ImageSection>
                </FormCard>

                <SaveButton onPress={handleSave} disabled={uploading}>
                  {uploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <SaveButtonText>
                      {route.params?.isEditMode ? t('add.updateRecord') : t('add.saveRecord')}
                    </SaveButtonText>
                  )}
                </SaveButton>
              </>
            )}
          </ContentContainer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}
