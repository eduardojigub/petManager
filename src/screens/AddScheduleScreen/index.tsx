import React, { useState, useContext } from 'react';
import {
  Alert,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { Calendar, Clock, CheckSquare } from 'phosphor-react-native';
import {
  Container,
  StyledTextInput,
  DatePickerButton,
  DatePickerText,
  AddButton,
  ButtonText,
  IconRow,
  CheckboxRow,
  CheckboxText,
  TypeOption,
  TypeOptionText,
  SectionTitle,
  TypeSelectorWrapper,
  KeyboardAvoidingContainer,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import DatePickerField from '../../components/DatePickerField';
import TypeSelectorComponent from '../../components/TypeSelector';
import { StackScreenProps } from '@react-navigation/stack';
import { ScheduleStackParamList } from '../../types/navigation';
import { HEALTH_SCHEDULE_TYPES } from '../../constants/typeOptions';

type Props = StackScreenProps<ScheduleStackParamList, 'AddSchedule'>;

export default function AddScheduleScreen({ route, navigation }: Props) {
  const { schedule, isEditMode = false } = route.params || {};
  const { selectedDog } = useContext(DogProfileContext);

  const convertTo24HourFormat = (timeString) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes, seconds] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds || 0).padStart(2, '0')}`;
  };

  const parsedDate = schedule?.date
    ? new Date(Date.parse(`${schedule.date}T00:00:00`))
    : new Date();

  const parsedTime = schedule?.time
    ? new Date(`1970-01-01T${convertTo24HourFormat(schedule.time)}`)
    : new Date();

  const [description, setDescription] = useState(schedule?.description || '');
  const [date, setDate] = useState(parsedDate);
  const [time, setTime] = useState(parsedTime);
  const [type, setType] = useState(schedule?.type || 'Other');
  const [isPushNotificationReminder, setIsPushNotificationReminder] = useState(
    schedule?.pushNotification || false
  );

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'The schedule description cannot be empty.');
      return;
    }

    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not logged in. Please log in to save schedules.');
      return;
    }

    const now = new Date();

    let selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
    let selectedDateTimeForSave = new Date(selectedDateTime);

    if (Platform.OS === 'android') {
      const selectedDateTimeWithBuffer = new Date(selectedDateTime.getTime() + 120000);
      if (selectedDateTimeWithBuffer <= now) {
        Alert.alert('Invalid Date/Time', 'Please select a date and time that is in the future.');
        return;
      }
    } else {
      if (selectedDateTime <= now) {
        Alert.alert('Invalid Date/Time', 'Please select a date and time that is in the future.');
        return;
      }
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Schedule Reminder',
          body: `Reminder: ${description}`,
          sound: true,
        },
        trigger: { date: selectedDateTime },
      });

      const scheduleData = {
        description,
        date: date.toLocaleDateString('en-CA'),
        time: selectedDateTimeForSave.toLocaleTimeString(),
        dogId: selectedDog.id,
        userId,
        notificationId,
        type,
        emailReminder: false,
        pushNotification: isPushNotificationReminder,
      };

      if (isEditMode && schedule) {
        await updateDoc(doc(db, 'schedules', schedule.id), scheduleData);
        Alert.alert('Success', 'Schedule updated successfully!');
      } else {
        await addDoc(collection(db, 'schedules'), scheduleData);
        Alert.alert('Success', 'Schedule saved successfully and notification scheduled!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule', error);
      Alert.alert('Error', 'Failed to save schedule.');
    }
  };

  return (
    <KeyboardAvoidingContainer
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StyledTextInput
            placeholder="Schedule Description"
            value={description}
            onChangeText={setDescription}
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <SectionTitle>Select Type:</SectionTitle>
          <TypeSelectorWrapper>
            <TypeSelectorComponent
              types={HEALTH_SCHEDULE_TYPES}
              selected={type}
              onSelect={setType}
              renderOption={(item, isSelected, onPress) => (
                <TypeOption key={item.label} onPress={onPress} selected={isSelected}>
                  {item.icon}
                  <TypeOptionText>{item.label}</TypeOptionText>
                </TypeOption>
              )}
            />
          </TypeSelectorWrapper>

          <DatePickerField
            value={date}
            onChange={setDate}
            mode="date"
            label="Select Date"
            renderButton={(onPress, displayText) => (
              <DatePickerButton onPress={onPress}>
                <IconRow>
                  <Calendar size={24} color="#41245C" />
                  <DatePickerText>Select Date: {date.toLocaleDateString()}</DatePickerText>
                </IconRow>
              </DatePickerButton>
            )}
          />

          <DatePickerField
            value={time}
            onChange={setTime}
            mode="time"
            label="Select Time"
            renderButton={(onPress, displayText) => (
              <DatePickerButton onPress={onPress}>
                <IconRow>
                  <Clock size={24} color="#41245C" />
                  <DatePickerText>Select Time: {time.toLocaleTimeString()}</DatePickerText>
                </IconRow>
              </DatePickerButton>
            )}
          />

          <CheckboxRow>
            <TouchableOpacity
              onPress={() => setIsPushNotificationReminder(!isPushNotificationReminder)}
            >
              <CheckSquare
                size={24}
                color={isPushNotificationReminder ? '#41245C' : '#ddd'}
              />
            </TouchableOpacity>
            <CheckboxText>I want to be notified</CheckboxText>
          </CheckboxRow>

          <AddButton onPress={handleSave}>
            <ButtonText>
              {isEditMode ? 'Update Schedule' : 'Save Schedule'}
            </ButtonText>
          </AddButton>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}
