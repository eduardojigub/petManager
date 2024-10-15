import React, { useState, useContext } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Icon from 'phosphor-react-native';
import { Container, StyledTextInput, DatePickerButton, DatePickerText, AddButton, ButtonText, IconRow, CheckboxRow, CheckboxText, TypeOption, TypeOptionText } from './styles';
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
  const [type, setType] = useState('Other'); // Default type
  const [isEmailReminder, setIsEmailReminder] = useState(false);
  const [isPushNotificationReminder, setIsPushNotificationReminder] = useState(false);

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
      // Adjust notification date to local time
      const notificationDate = new Date(date);
      notificationDate.setHours(time.getHours());
      notificationDate.setMinutes(time.getMinutes());
  
      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Schedule Reminder',
          body: `Reminder: ${description}`,
          sound: true,
        },
        trigger: notificationDate,
      });
  
      // Format date as a local date string instead of UTC
      const localDateString = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  
      // Create a new schedule object with formatted date
      const newSchedule = {
        description,
        date: localDateString, // Save as local date string
        time: time.toLocaleTimeString(),
        dogId: selectedDog.id,
        userId,
        notificationId,
        type,  // Add type to Firestore document
        emailReminder: isEmailReminder,
        pushNotification: isPushNotificationReminder,
      };
  
      // Save the schedule to Firestore
      await db.collection('schedules').add(newSchedule);
  
      Alert.alert('Success', 'Schedule saved successfully and notification scheduled!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule', error);
      Alert.alert('Error', 'Failed to save schedule.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  const onTimeChange = (event, selectedTime) => {
    if (selectedTime) setTempTime(selectedTime);
  };

  return (
    <Container>
      <StyledTextInput
        placeholder="Schedule Description"
        value={description}
        onChangeText={setDescription}
      />

        {/* Type Selection */}
        <Text style={{ fontSize: 18, color: "#41245C", marginBottom: 10 }}>Select Type:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {[
          { label: 'Vaccine', icon: <Icon.Syringe size={20} color="#7289DA" /> },
          { label: 'Vet Appointment', icon: <Icon.Stethoscope size={20} color="#7289DA" /> },
          { label: 'Medication', icon: <Icon.Pill size={20} color="#7289DA" /> },
          { label: 'Dog Groomer', icon: <Icon.Scissors size={20} color="#7289DA" /> },
          { label: 'Other', icon: <Icon.FileText size={20} color="#7289DA" /> },
        ].map((option) => (
          <TypeOption key={option.label} onPress={() => setType(option.label)} selected={type === option.label}>
            {option.icon}
            <TypeOptionText>{option.label}</TypeOptionText>
          </TypeOption>
        ))}
      </View>

      {/* Date Picker Button */}
      <DatePickerButton onPress={() => setShowDateModal(true)}>
        <IconRow>
          <Icon.Calendar size={24} color="#41245C" />
          <DatePickerText>Select Date: {date.toLocaleDateString()}</DatePickerText>
        </IconRow>
      </DatePickerButton>

      <Modal visible={showDateModal} transparent animationType="slide" onRequestClose={() => setShowDateModal(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Select Date</Text>
            <DateTimePicker value={tempDate} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onDateChange} />
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

      <DatePickerButton onPress={() => setShowTimeModal(true)}>
        <IconRow>
          <Icon.Clock size={24} color="#41245C" />
          <DatePickerText>Select Time: {time.toLocaleTimeString()}</DatePickerText>
        </IconRow>
      </DatePickerButton>

      <Modal visible={showTimeModal} transparent animationType="slide" onRequestClose={() => setShowTimeModal(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Select Time</Text>
            <DateTimePicker value={tempTime} mode="time" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onTimeChange} />
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

      {/* Checkbox for email reminder */}
      {/* <CheckboxRow>
        <TouchableOpacity onPress={() => setIsEmailReminder(!isEmailReminder)}>
          <Icon.CheckSquare size={24} color={isEmailReminder ? "#41245C" : "#ddd"} />
        </TouchableOpacity>
        <CheckboxText>Send me a reminder per email</CheckboxText>
      </CheckboxRow> */}

      {/* Checkbox for push notification reminder */}
      <CheckboxRow>
        <TouchableOpacity onPress={() => setIsPushNotificationReminder(!isPushNotificationReminder)}>
          <Icon.CheckSquare size={24} color={isPushNotificationReminder ? "#41245C" : "#ddd"} />
        </TouchableOpacity>
        <CheckboxText>I want to be notified</CheckboxText>
      </CheckboxRow>

      <AddButton onPress={handleSave}>
        <ButtonText>Save Schedule</ButtonText>
      </AddButton>
    </Container>
  );
}
