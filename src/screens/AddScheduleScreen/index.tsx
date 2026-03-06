import React, { useState, useContext } from 'react';
import {
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarBlank, Clock, Bell } from 'phosphor-react-native';
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
  MultilineInput,
  DateButton,
  DateButtonText,
  ReminderRow,
  ReminderLabel,
  ReminderChipsRow,
  ReminderChip,
  ReminderChipText,
  SaveButton,
  SaveButtonText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import DatePickerField from '../../components/DatePickerField';
import { StackScreenProps } from '@react-navigation/stack';
import { ScheduleStackParamList } from '../../types/navigation';
import { HEALTH_SCHEDULE_TYPES } from '../../constants/typeOptions';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { LanguageContext } from '../../context/LanguageContext';

type Props = StackScreenProps<ScheduleStackParamList, 'AddSchedule'>;

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

const REMINDER_OPTION_KEYS = [
  { key: 'add.atTime', minutes: 0 },
  { key: 'add.15min', minutes: 15 },
  { key: 'add.1hour', minutes: 60 },
  { key: 'add.3hours', minutes: 180 },
  { key: 'add.1day', minutes: 1440 },
  { key: 'add.3days', minutes: 4320 },
];

export default function AddScheduleScreen({ route, navigation }: Props) {
  const { schedule, isEditMode = false } = route.params || {};
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const parseTimeString = (timeString: string): Date => {
    const parts = timeString.trim().split(' ');
    const timePart = parts[0];
    const modifier = parts[1]?.toUpperCase();
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier) {
      // 12h format: "9:20:00 PM"
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
    }
    // else: already 24h format "21:20"

    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const parsedDate = schedule?.date
    ? new Date(Date.parse(`${schedule.date}T00:00:00`))
    : new Date();

  const parsedTime = schedule?.time
    ? parseTimeString(schedule.time)
    : new Date();

  const [description, setDescription] = useState(schedule?.description || '');
  const [date, setDate] = useState(parsedDate);
  const [time, setTime] = useState(parsedTime);
  const [type, setType] = useState(schedule?.type || '');
  const [reminder, setReminder] = useState(schedule?.pushNotification || false);
  const [reminderMinutes, setReminderMinutes] = useState(
    schedule?.reminderMinutes ?? 60
  );

  const handleSave = async () => {
    if (!type) {
      Alert.alert(t('common.error'), t('alert.selectType'));
      return;
    }
    if (!description.trim()) {
      Alert.alert(t('common.error'), t('alert.addDescription'));
      return;
    }

    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      Alert.alert(t('common.error'), t('alert.userNotLogged'));
      return;
    }

    const now = new Date();
    let selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
    let selectedDateTimeForSave = new Date(selectedDateTime);

    if (Platform.OS === 'android') {
      const selectedDateTimeWithBuffer = new Date(selectedDateTime.getTime() + 120000);
      if (selectedDateTimeWithBuffer <= now) {
        Alert.alert(t('alert.invalidDateTime'), t('alert.invalidDateTimeMsg'));
        return;
      }
    } else {
      if (selectedDateTime <= now) {
        Alert.alert(t('alert.invalidDateTime'), t('alert.invalidDateTimeMsg'));
        return;
      }
    }

    try {
      // Cancel existing notification if editing
      if (isEditMode && schedule?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(schedule.notificationId).catch(() => {});
      }

      let notificationId: string | null = null;
      let reminderScheduled = false;

      if (reminder) {
        const globalEnabled = await AsyncStorage.getItem('notificationsEnabled');
        if (globalEnabled !== 'false') {
          const notifyAt = new Date(selectedDateTime.getTime() - reminderMinutes * 60 * 1000);
          const reminderLabel = REMINDER_OPTION_KEYS.find((o) => o.minutes === reminderMinutes);
          const reminderText = reminderLabel ? t(reminderLabel.key) : '';
          const bodyText = reminderMinutes === 0
            ? `${t('add.atTime')}: ${description}`
            : `${description} - ${reminderText}`;

          if (notifyAt.getTime() > Date.now() + 60000) {
            notificationId = await Notifications.scheduleNotificationAsync({
              content: {
                title: `${t(`type.${type}`)} - ${t('add.reminder')}`,
                body: bodyText,
                sound: true,
              },
              trigger: { type: SchedulableTriggerInputTypes.DATE, date: notifyAt.getTime() },
            });
            reminderScheduled = true;
          } else {
            Alert.alert(t('notification.pastReminderTitle'), t('notification.pastReminderMsg'));
          }
        }
      }

      // Save time in consistent 24h format "HH:mm"
      const savedTime = `${String(selectedDateTimeForSave.getHours()).padStart(2, '0')}:${String(selectedDateTimeForSave.getMinutes()).padStart(2, '0')}`;

      const scheduleData = {
        description,
        date: date.toLocaleDateString('en-CA'),
        time: savedTime,
        dogId: selectedDog.id,
        userId,
        notificationId,
        type,
        emailReminder: false,
        pushNotification: reminderScheduled,
        reminderMinutes: reminderScheduled ? reminderMinutes : null,
      };

      if (isEditMode && schedule) {
        await updateDoc(doc(db, 'schedules', schedule.id), scheduleData);
        Alert.alert(t('common.success'), t('alert.scheduleUpdated'));
      } else {
        await addDoc(collection(db, 'schedules'), scheduleData);
        Alert.alert(t('common.success'), t('alert.scheduleSaved'));
      }
      if (route.params?.fromProfile) {
        navigation.navigate('ProfileTab' as any);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving schedule', error);
      Alert.alert(t('common.error'), t('alert.failedSaveSchedule'));
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

            {type ? (
              <>
                <FormCard>
                  {/* Description */}
                  <InputGroup>
                    <InputLabel>{t('add.description')}</InputLabel>
                    <MultilineInput
                      value={description}
                      onChangeText={setDescription}
                      placeholder={t('add.descriptionPlaceholder')}
                      placeholderTextColor="#ccc"
                      multiline
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </InputGroup>

                  {/* Date */}
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

                  {/* Time */}
                  <InputGroup>
                    <InputLabel>{t('add.time')}</InputLabel>
                    <DatePickerField
                      value={time}
                      onChange={setTime}
                      mode="time"
                      label={t('add.selectTime')}
                      renderButton={(onPress, displayText) => (
                        <DateButton onPress={onPress}>
                          <Clock size={20} color="#41245c" />
                          <DateButtonText hasValue>{displayText}</DateButtonText>
                        </DateButton>
                      )}
                    />
                  </InputGroup>

                  {/* Reminder */}
                  <InputGroup>
                    <InputLabel>{t('add.reminder')}</InputLabel>
                    <ReminderRow>
                      <Bell size={20} color="#41245c" />
                      <ReminderLabel>{t('add.remindBefore')}</ReminderLabel>
                      <Switch
                        value={reminder}
                        onValueChange={setReminder}
                        trackColor={{ false: '#ddd', true: '#7289da' }}
                        thumbColor={reminder ? '#41245c' : '#f4f3f4'}
                      />
                    </ReminderRow>
                    {reminder && (
                      <>
                        <InputLabel style={{ marginTop: 10 }}>{t('add.howEarly')}</InputLabel>
                        <ReminderChipsRow>
                          {REMINDER_OPTION_KEYS.map((option) => (
                            <ReminderChip
                              key={option.minutes}
                              selected={reminderMinutes === option.minutes}
                              onPress={() => setReminderMinutes(option.minutes)}
                            >
                              <ReminderChipText selected={reminderMinutes === option.minutes}>
                                {t(option.key)}
                              </ReminderChipText>
                            </ReminderChip>
                          ))}
                        </ReminderChipsRow>
                      </>
                    )}
                  </InputGroup>
                </FormCard>

                <SaveButton onPress={handleSave}>
                  <SaveButtonText>
                    {isEditMode ? t('add.updateSchedule') : t('add.saveSchedule')}
                  </SaveButtonText>
                </SaveButton>
              </>
            ) : null}
          </ContentContainer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}
