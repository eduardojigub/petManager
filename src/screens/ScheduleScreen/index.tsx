import React, { useState, useContext } from 'react';
import { FlatList, Alert } from 'react-native';
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
  DisabledAddButton,
  ScheduleItemTouchable,
  CalendarIconWrapper,
  ClockIconWrapper,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { TrashSimple, Calendar, Clock } from 'phosphor-react-native';
import * as Notifications from 'expo-notifications';
import dogThingsImage from '../../assets/dogThings.png';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { confirmDelete } from '../../utils/confirmDelete';
import { ListItemDetailHint } from '../../styles/shared';
import EmptyStateList from '../../components/EmptyStateList';
import { StackScreenProps } from '@react-navigation/stack';
import { ScheduleStackParamList } from '../../types/navigation';

type Props = StackScreenProps<ScheduleStackParamList, 'ScheduleScreen'>;

export default function ScheduleScreen({ navigation }: Props) {
  const [schedules, setSchedules] = useState([]);
  const { selectedDog } = useContext(DogProfileContext);

  const loadSchedules = async () => {
    if (!selectedDog) {
      setSchedules([]);
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
      const isPastSchedule =
        scheduleDateTime < now &&
        scheduleDateTime.toDateString() !== now.toDateString();

      return { id: doc.id, ...data, isPast: isPastSchedule };
    });
    setSchedules(loadedSchedules);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!selectedDog) {
        setSchedules([]);
      } else {
        loadSchedules();
      }
    }, [selectedDog, navigation])
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
      console.error('Error deleting schedule', error);
      Alert.alert('Error', 'Failed to delete schedule');
    }
  };

  const handleDelete = (scheduleId: string, notificationId: string) => {
    confirmDelete({
      title: 'Delete Schedule',
      message: 'Are you sure you want to delete this schedule?',
      onConfirm: () => deleteSchedule(scheduleId, notificationId),
    });
  };

  const renderSchedule = ({ item }) => (
    <ListItem isPast={item.isPast}>
      <TypeIcon>{getHealthScheduleIcon(item.type)}</TypeIcon>
      <ScheduleItemTouchable
        onPress={() =>
          navigation.navigate('AddSchedule', {
            schedule: item,
            isEditMode: true,
          })
        }
      >
        <ListItemContent>
          <ListItemText
            isPast={item.isPast}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.description}
          </ListItemText>
          <IconRow>
            <CalendarIconWrapper>
              <Calendar size={20} color="#41245C" />
            </CalendarIconWrapper>
            <DetailDateText>{item.date}</DetailDateText>
            <ClockIconWrapper>
              <Clock size={20} color="#41245C" />
            </ClockIconWrapper>
            <DetailDateText>{item.time}</DetailDateText>
          </IconRow>
          <ListItemDetailHint>Tap to edit details</ListItemDetailHint>
        </ListItemContent>
      </ScheduleItemTouchable>
      <TrashIconContainer
        onPress={() => handleDelete(item.id, item.notificationId)}
      >
        <TrashSimple size={20} color="#e74c3c" />
      </TrashIconContainer>
    </ListItem>
  );

  return (
    <Container>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyStateList
            image={dogThingsImage}
            text="No schedules yet. Add your first pet and start adding to keep track of your pet's appointments."
          />
        }
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
