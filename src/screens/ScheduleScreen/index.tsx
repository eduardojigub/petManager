import React, { useState, useContext } from 'react';
import { FlatList, TouchableOpacity, Alert, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Container,
  ListItem,
  ListItemContent,
  ListItemText,
  IconRow,
  TrashIconContainer,
  AddButton,
  ButtonText,
  DetailDateText,
  TypeIcon,
  EmptyListContainer,
  EmptyListText,
  EmptyListImage,
  DisabledAddButton,
} from './styles';
import { PetContext } from '../../context/PetContext';
import { db } from '../../firebase/Firestore';
import * as Icon from 'phosphor-react-native';
import * as Notifications from 'expo-notifications';
import dogThingsImage from '../../assets/dogThings.png';

export default function ScheduleScreen({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const { selectedDog } = useContext(PetContext);

  const loadSchedules = async () => {
    if (!selectedDog) {
      setSchedules([]); // Clear schedules if no dog is selected
      return;
    }

    const schedulesSnapshot = await db
      .collection('schedules')
      .where('dogId', '==', selectedDog.id)
      .get();

    const loadedSchedules = schedulesSnapshot.docs.map((doc) => {
      const data = doc.data();
      const [year, month, day] = data.date.split('-').map(Number);
      const [hours, minutes] = data.time.split(':').map(Number);
      const scheduleDateTime = new Date(year, month - 1, day, hours, minutes);

      const now = new Date();
      const isPastSchedule = scheduleDateTime < now && scheduleDateTime.toDateString() !== now.toDateString();

      return { id: doc.id, ...data, isPast: isPastSchedule };
    });
    setSchedules(loadedSchedules);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!selectedDog) {
        setSchedules([]); // Clear schedules if no dog is selecte
      } else {
        loadSchedules(); // Load schedules if a dog is selected
      }
    }, [selectedDog, navigation])
  );

  const deleteSchedule = async (scheduleId, notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await db.collection('schedules').doc(scheduleId).delete();
      setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== scheduleId));
      Alert.alert('Success', 'Schedule and notification deleted successfully');
    } catch (error) {
      console.error('Error deleting schedule', error);
      Alert.alert('Error', 'Failed to delete schedule');
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

  // Map each type to an icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Vaccine':
        return <Icon.Syringe size={20} color="#7289DA" />;
      case 'Vet Appointment':
        return <Icon.Stethoscope size={20} color="#7289DA" />;
      case 'Medication':
        return <Icon.Pill size={20} color="#7289DA" />;
      case 'Dog Groomer':
        return <Icon.Scissors size={20} color="#7289DA" />;
      default:
        return <Icon.FileText size={20} color="#7289DA" />;
    }
  };

  const renderSchedule = ({ item }) => (
    <ListItem isPast={item.isPast}>
      <TypeIcon>{getTypeIcon(item.type)}</TypeIcon>
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
            <DetailDateText>{item.date}</DetailDateText>
            <Icon.Clock size={20} color="#41245C" style={{ marginLeft: 10, marginRight: 5 }} />
            <DetailDateText>{item.time}</DetailDateText>
          </IconRow>
        </ListItemContent>
      </TouchableOpacity>
      <TrashIconContainer onPress={() => handleDelete(item.id, item.notificationId)}>
        <Icon.TrashSimple size={20} color="#e74c3c" />
      </TrashIconContainer>
    </ListItem>
  );

  const renderEmptyList = () => (
    <EmptyListContainer>
      <EmptyListImage source={dogThingsImage} />
      <EmptyListText>
        No schedules yet. Add your first pet and start adding to keep track of your pet's appointments.
      </EmptyListText>
    </EmptyListContainer>
  );

  return (
    <Container>
      <Text style={{ fontSize: 24, color: '#41245C', marginBottom: 20 }}>
        Schedules {selectedDog ? `for ${selectedDog.name}` : null}
      </Text>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
      {selectedDog ? (
        <AddButton onPress={() => navigation.navigate('AddSchedule')}>
          <ButtonText>Add Schedule</ButtonText>
        </AddButton>
      ) : (
        <DisabledAddButton disabled>
          <ButtonText>Add Schedule</ButtonText>
        </DisabledAddButton>
      )}
    </Container>
  );
}
