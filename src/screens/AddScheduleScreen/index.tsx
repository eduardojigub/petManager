import React, { useState, useContext } from 'react';
import { TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { Container, ButtonText, AddButton } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext'; // Get the selected dog from context
import { db } from '../../firebase/Firestore'; // Firestore instance

export default function AddScheduleScreen({ navigation }) {
  const { selectedDog } = useContext(DogProfileContext); // Get the selected dog from the context
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'The schedule description cannot be empty.');
      return;
    }

    const newSchedule = {
      description,
      date: date.toLocaleDateString(),
      time: time.toLocaleTimeString(),
      dogId: selectedDog.id, // Associate the schedule with the selected dog's ID
    };

    try {
      // Save the new schedule to Firestore
      await db.collection('schedules').add(newSchedule);

      // Schedule notification for the selected time
      const notificationDate = new Date(date);
      notificationDate.setHours(time.getHours());
      notificationDate.setMinutes(time.getMinutes());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Schedule Reminder',
          body: `Reminder: ${description}`,
          sound: true,
        },
        trigger: notificationDate,
      });

      Alert.alert('Success', 'Schedule saved successfully and notification scheduled!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule', error);
      Alert.alert('Error', 'Failed to save schedule.');
    }
  };

  return (
    <Container>
      <TextInput
        placeholder="Schedule Description"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
      />
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => setDate(selectedDate || date)}
      />
      <DateTimePicker
        value={time}
        mode="time"
        display="default"
        onChange={(event, selectedTime) => setTime(selectedTime || time)}
      />
      <AddButton onPress={handleSave}>
        <ButtonText>Save Schedule</ButtonText>
      </AddButton>
    </Container>
  );
}
