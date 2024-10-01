import React, { useState, useContext } from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container, AddButton, ButtonText, ListItem, ListItemText } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext'; // Import the selected dog context
import { db } from '../../firebase/Firestore'; // Firestore instance

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

  const renderSchedule = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EditSchedule', { schedule: item })}>
      <ListItem>
        <ListItemText>{item.description}</ListItemText>
        <ListItemText>{item.date} - {item.time}</ListItemText>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Schedules for {selectedDog?.name}</Text>
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
