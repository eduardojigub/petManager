import React, { useState, useContext } from 'react';
import { Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container, AddButton, ButtonText, ListItem, ListItemContent, ListItemText, IconRow, TrashIconContainer } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import * as Notifications from 'expo-notifications';
import * as Icon from 'phosphor-react-native';

export default function ScheduleScreen({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const { selectedDog } = useContext(DogProfileContext);
  
  
  const loadSchedules = async () => {
    try {
      if (selectedDog) {
        const schedulesSnapshot = await db
          .collection('schedules')
          .where('dogId', '==', selectedDog.id)
          .get();
  
        const loadedSchedules = schedulesSnapshot.docs.map((doc) => {
          const data = doc.data();
  
          // Parse date and time components separately
          const [year, month, day] = data.date.split('-').map(Number);
          const [hours, minutes] = data.time.split(':').map(Number);
  
          // Create scheduleDateTime in the local timezone
          const scheduleDateTime = new Date(year, month - 1, day, hours, minutes);
  
          const now = new Date();
          const isPastSchedule = scheduleDateTime < now && (
            scheduleDateTime.toDateString() !== now.toDateString() // Only mark as past if not today
          );
  
          return { id: doc.id, ...data, isPast: isPastSchedule };
        });
  
        setSchedules(loadedSchedules);
      }
    } catch (error) {
      console.error('Error loading schedules', error);
    }
  };
  
  

  useFocusEffect(
    React.useCallback(() => {
      if (selectedDog) {
        loadSchedules();
      }
    }, [selectedDog])
  );

  const deleteSchedule = async (scheduleId, notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
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
    <ListItem isPast={item.isPast}>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddSchedule', { schedule: item, isEditMode: true })}
        style={{ flex: 1 }}
      >
        <ListItemContent>
          <ListItemText isPast={item.isPast} numberOfLines={1} ellipsizeMode="tail">
            {item.description}
          </ListItemText>
          <IconRow>
            <Icon.Calendar size={20} color="#41245C" style={{ marginRight: 5 }} />
            <ListItemText isPast={item.isPast}>{item.date}</ListItemText>
            <Icon.Clock size={20} color="#41245C" style={{ marginLeft: 10, marginRight: 5 }} />
            <ListItemText isPast={item.isPast}>{item.time}</ListItemText>
          </IconRow>
        </ListItemContent>
      </TouchableOpacity>
      <TrashIconContainer onPress={() => handleDelete(item.id, item.notificationId)}>
        <Icon.Trash size={24} color="#e74c3c" />
      </TrashIconContainer>
    </ListItem>
  );
  
  return (
    <Container>
      <Text style={{ fontSize: 24, color: "#41245C", marginBottom: 20 }}>
        Schedules {selectedDog ? 'for ' + selectedDog?.name : null}
      </Text>
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
