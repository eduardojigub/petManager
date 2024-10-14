import React, { useState, useContext } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Icon from 'phosphor-react-native';
import { Container, StyledTextInput, DatePickerButton, DatePickerText, AddButton, ButtonText, IconRow } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import auth from '@react-native-firebase/auth';

export default function AddScheduleScreen({ navigation }) {
  const { selectedDog } = useContext(DogProfileContext);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'The schedule description cannot be empty.');
      return;
    }

    const userId = auth().currentUser?.uid;

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
        date: date.toISOString().split('T')[0],
        time: time.toLocaleTimeString(),
        dogId: selectedDog.id,
        userId,
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

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) setTempDate(selectedDate); // Update tempDate instead of date
  };

  const onTimeChange = (event, selectedTime) => {
    if (selectedTime) setTempTime(selectedTime); // Update tempTime instead of time
  };

  return (
    <Container>
      <StyledTextInput
        placeholder="Schedule Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Date Picker Button */}
      <DatePickerButton onPress={() => setShowDateModal(true)}>
        <IconRow>
          <Icon.Calendar size={24} color="#41245C" />
          <DatePickerText>Select Date: {date.toLocaleDateString()}</DatePickerText>
        </IconRow>
      </DatePickerButton>

      {/* Date Picker Modal */}
      <Modal
        visible={showDateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Select Date</Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onDateChange}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text style={{ color: '#7289DA', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setDate(tempDate); setShowDateModal(false); }}>
                <Text style={{ color: '#7289DA', fontSize: 16 }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Button */}
      <DatePickerButton onPress={() => setShowTimeModal(true)}>
        <IconRow>
          <Icon.Clock size={24} color="#41245C" />
          <DatePickerText>Select Time: {time.toLocaleTimeString()}</DatePickerText>
        </IconRow>
      </DatePickerButton>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Select Time</Text>
            <DateTimePicker
              value={tempTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onTimeChange}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Text style={{ color: '#7289DA', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setTime(tempTime); setShowTimeModal(false); }}>
                <Text style={{ color: '#7289DA', fontSize: 16 }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AddButton onPress={handleSave}>
        <ButtonText>Save Schedule</ButtonText>
      </AddButton>
    </Container>
  );
}
