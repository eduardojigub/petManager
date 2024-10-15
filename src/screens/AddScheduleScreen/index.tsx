import React, { useState, useContext, useEffect } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Icon from 'phosphor-react-native';
import { Container, StyledTextInput, DatePickerButton, DatePickerText, AddButton, ButtonText, IconRow, CheckboxRow, CheckboxText, TypeOption, TypeOptionText } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import auth from '@react-native-firebase/auth';

export default function AddScheduleScreen({ route, navigation }) {
  const { schedule, isEditMode = false } = route.params || {}; // Get schedule and edit mode from params
  const { selectedDog } = useContext(DogProfileContext);

  // Initialize state with either existing data (for edit mode) or default values
  const [description, setDescription] = useState(schedule?.description || '');
  const [date, setDate] = useState(schedule ? new Date(schedule.date) : new Date());
  const [time, setTime] = useState(schedule ? new Date(`1970-01-01T${schedule.time}`) : new Date());
  const [type, setType] = useState(schedule?.type || 'Other'); // Default type
  const [isEmailReminder, setIsEmailReminder] = useState(schedule?.emailReminder || false);
  const [isPushNotificationReminder, setIsPushNotificationReminder] = useState(schedule?.pushNotification || false);
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

      // Prepare schedule data with the type and other values
      const scheduleData = {
        description,
        date: date.toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
        time: time.toLocaleTimeString(),
        dogId: selectedDog.id,
        userId,
        notificationId,
        type, // Include type in data
        emailReminder: isEmailReminder,
        pushNotification: isPushNotificationReminder,
      };

      // Check if editing an existing schedule or creating a new one
      if (isEditMode && schedule) {
        // Update the existing schedule
        await db.collection('schedules').doc(schedule.id).update(scheduleData);
        Alert.alert('Success', 'Schedule updated successfully!');
      } else {
        // Add a new schedule
        await db.collection('schedules').add(scheduleData);
        Alert.alert('Success', 'Schedule saved successfully and notification scheduled!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule', error);
      Alert.alert('Error', 'Failed to save schedule.');
    }
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
            <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={(event, selectedDate) => { if (selectedDate) setDate(selectedDate); setShowDateModal(false); }} />
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

      <Modal visible={showTimeModal} transparent animationType="slide" onRequestClose={() => setShowTimeModal(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Select Time</Text>
            <DateTimePicker value={time} mode="time" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={(event, selectedTime) => { if (selectedTime) setTime(selectedTime); setShowTimeModal(false); }} />
          </View>
        </View>
      </Modal>

      {/* Checkbox for push notification reminder */}
      <CheckboxRow>
        <TouchableOpacity onPress={() => setIsPushNotificationReminder(!isPushNotificationReminder)}>
          <Icon.CheckSquare size={24} color={isPushNotificationReminder ? "#41245C" : "#ddd"} />
        </TouchableOpacity>
        <CheckboxText>I want to be notified</CheckboxText>
      </CheckboxRow>

      <AddButton onPress={handleSave}>
        <ButtonText>{isEditMode ? 'Update Schedule' : 'Save Schedule'}</ButtonText>
      </AddButton>
    </Container>
  );
}
