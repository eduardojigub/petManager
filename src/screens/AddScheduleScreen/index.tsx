import React, { useState, useContext } from 'react';
import { TextInput, Alert, Platform, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { Container, ButtonText, AddButton } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth

export default function AddScheduleScreen({ navigation }) {
  const { selectedDog } = useContext(DogProfileContext);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'The schedule description cannot be empty.');
      return;
    }

    const userId = auth().currentUser?.uid; // Get the current user's ID

    if (!userId) {
      Alert.alert('Error', 'User not logged in. Please log in to save schedules.');
      return;
    }

    try {
      const notificationDate = new Date(date);
      notificationDate.setHours(time.getHours());
      notificationDate.setMinutes(time.getMinutes());

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Schedule Reminder',
          body: `Reminder: ${description}`,
          sound: true,
        },
        trigger: notificationDate,
      });

      const newSchedule = {
        description,
        date: date.toLocaleDateString(),
        time: time.toLocaleTimeString(),
        dogId: selectedDog.id,
        userId, // Attach the userId to the schedule
        notificationId,
      };

      await db.collection('schedules').add(newSchedule);

      Alert.alert('Success', 'Schedule saved successfully and notification scheduled!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule', error);
      Alert.alert('Error', 'Failed to save schedule.');
    }
  };

  // Handle Date Picker change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  // Handle Time Picker change
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <Container>
      <TextInput
        placeholder="Schedule Description"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
      />
      
      <Button title={`Select Date: ${date.toLocaleDateString()}`} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Button title={`Select Time: ${time.toLocaleTimeString()}`} onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <AddButton onPress={handleSave}>
        <ButtonText>Save Schedule</ButtonText>
      </AddButton>
    </Container>
  );
}
