import React, { useState, useContext } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Icon from 'phosphor-react-native';
import { Container, StyledTextInput, DatePickerButton, DatePickerText, AddButton, ButtonText, IconRow, CheckboxRow, CheckboxText, TypeOption, TypeOptionText } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import auth from '@react-native-firebase/auth';

export default function AddScheduleScreen({ route, navigation }) {
  const { schedule, isEditMode = false } = route.params || {};
  const { selectedDog } = useContext(DogProfileContext);
  function convertTo24HourFormat(timeString) {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes, seconds] = time.split(':').map(Number);
  
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds || 0).padStart(2, '0')}`;
  }  
  
  const parsedDate = schedule?.date
  ? new Date(Date.parse(`${schedule.date}T00:00:00`))
  : new Date();
  // Initialize state
  const [description, setDescription] = useState(schedule?.description || '');
  const [date, setDate] = useState(parsedDate);
  const [tempDate, setTempDate] = useState(parsedDate);



  // Check if schedule.time exists and parse it correctly
  // Ensure the time has the right format (HH:mm:ss) by padding if necessary
  const parsedTime = schedule?.time
  ? new Date(`1970-01-01T${convertTo24HourFormat(schedule.time)}`)
  : new Date();

  const [time, setTime] = useState(parsedTime);
  const [tempTime, setTempTime] = useState(parsedTime);

  const [type, setType] = useState(schedule?.type || 'Other');
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
  
    // Get the current date and time
    const now = new Date();
  
    // Combine selected date and time for validation
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(tempTime.getHours(), tempTime.getMinutes(), 0, 0);
  
    // Check if selected date is in the past or the same day but with an earlier time
    if (selectedDateTime < now) {
      Alert.alert(
        'Invalid Date/Time',
        'Please select a date and time that is in the future.'
      );
      return;
    }
  
    try {
      const notificationDate = new Date(date);
      notificationDate.setHours(tempTime.getHours(), tempTime.getMinutes(), 0, 0);
  
      if (isNaN(notificationDate.getTime())) {
        throw new Error('Invalid date for notification');
      }
  
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Schedule Reminder',
          body: `Reminder: ${description}`,
          sound: true,
        },
        trigger: {
          type: 'date',
          timestamp: notificationDate.getTime(),
        },
      });
  
      const scheduleData = {
        description,
        date: date.toLocaleDateString('en-CA'),
        time: time.toLocaleTimeString(),
        dogId: selectedDog.id,
        userId,
        notificationId,
        type,
        emailReminder: isEmailReminder,
        pushNotification: isPushNotificationReminder,
      };
  
      if (isEditMode && schedule) {
        await db.collection('schedules').doc(schedule.id).update(scheduleData);
        Alert.alert('Success', 'Schedule updated successfully!');
      } else {
        await db.collection('schedules').add(scheduleData);
        Alert.alert('Success', 'Schedule saved successfully and notification scheduled!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule', error);
      Alert.alert('Error', 'Failed to save schedule.');
    }
  };;

  return (
    <Container>
      <StyledTextInput
        placeholder="Schedule Description"
        value={description}
        onChangeText={setDescription}
      />

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

      <DatePickerButton onPress={() => setShowDateModal(true)}>
        <IconRow>
          <Icon.Calendar size={24} color="#41245C" />
          <DatePickerText>Select Date: {date.toLocaleDateString()}</DatePickerText>
        </IconRow>
      </DatePickerButton>

      {/* Date Picker Modal */}
      <Modal visible={showDateModal} transparent animationType="slide" onRequestClose={() => setShowDateModal(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Select Date</Text>
            <DateTimePicker value={tempDate} mode="date" display="default" onChange={(event, selectedDate) => selectedDate && setTempDate(selectedDate)} />
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

      {/* Time Picker Modal */}
      <Modal visible={showTimeModal} transparent animationType="slide" onRequestClose={() => setShowTimeModal(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Select Time</Text>
            <DateTimePicker value={tempTime} mode="time" display="default" onChange={(event, selectedTime) => selectedTime && setTempTime(selectedTime)} />
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

