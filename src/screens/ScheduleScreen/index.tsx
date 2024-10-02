import React, { useState, useContext } from 'react';
import { Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container, AddButton, ButtonText, ListItem, ListItemText } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext'; // Import the selected dog context
import { db } from '../../firebase/Firestore'; // Firestore instance
import * as Notifications from 'expo-notifications'; // Import Notifications
import Feather from '@expo/vector-icons/Feather'; // For trash icon

export default function ScheduleScreen({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const { selectedDog } = useContext(DogProfileContext); // Get the selected dog from context

  // Function to load schedules from Firestore filtered by dogId
  const loadSchedules = async () => {
    try {
      if (selectedDog) {
        const schedulesSnapshot = await db
          .collection('schedules')
          .where('dogId', '==', selectedDog.id)
          .get();

        const loadedSchedules = schedulesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSchedules(loadedSchedules);
      }
    } catch (error) {
      console.error('Error loading schedules', error);
    }
  };

  // useFocusEffect to load data every time the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      if (selectedDog) {
        loadSchedules(); // Reload schedules on screen focus
      }
    }, [selectedDog])
  );

  // Function to delete a schedule and cancel its notification
  const deleteSchedule = async (scheduleId, notificationId) => {
    try {
      // Delete the notification using the notificationId
      await Notifications.cancelScheduledNotificationAsync(notificationId);
  
      // Remove the schedule from Firestore
      await db.collection('schedules').doc(scheduleId).delete();
  
      setSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.id !== scheduleId)
      );
  
      Alert.alert('Success', 'Schedule and notification deleted successfully');
    } catch (error) {
      console.error('Error deleting schedule and notification', error);
      Alert.alert('Error', 'Failed to delete schedule or notification');
    }
  };
  
  // Usage example
  const handleDelete = (scheduleId, notificationId) => {
    Alert.alert(
      'Delete Schedule',
      'Are you sure you want to delete this schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteSchedule(scheduleId, notificationId) },
      ],
      { cancelable: true }
    );
  };
  

  const renderSchedule = ({ item }) => (
    <ListItem>
      <TouchableOpacity onPress={() => navigation.navigate('EditSchedule', { schedule: item })}>
        <ListItemText>{item.description}</ListItemText>
        <ListItemText>{item.date} - {item.time}</ListItemText>
      </TouchableOpacity>
      {/* Trash can icon to delete the schedule */}
      <TouchableOpacity onPress={() => handleDelete(item.id, item.notificationId)}>
        <Feather name="trash" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </ListItem>
  );

  return (
    <Container>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Schedules {selectedDog ? 'for' + selectedDog?.name : null}</Text>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={(item) => item.id}
      />
      <AddButton onPress={() => navigation.navigate('AddSchedule')}>
        <ButtonText>Add Schedule</ButtonText>
      </AddButton>
    </Container>
  );
}
