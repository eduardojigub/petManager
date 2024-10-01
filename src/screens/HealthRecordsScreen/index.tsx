import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import { Container, ListItem, ListItemText, AddButton, ButtonText } from "./styles";
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore'; // Firestore import

export default function HealthRecordsScreen({ navigation }) {
  const [healthRecords, setHealthRecords] = useState([]);
  const { selectedDog } = useContext(DogProfileContext); // Get the selected dog

  // Load records from Firestore when the screen mounts
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const recordsSnapshot = await db.collection('healthRecords')
          .where('dogId', '==', selectedDog.id) // Filter by the selected dog's ID
          .get();
          
        const records = recordsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setHealthRecords(records);
      } catch (error) {
        console.error('Error loading health records', error);
      }
    };

    if (selectedDog) {
      loadRecords();
    }
  }, [selectedDog]);

  const addHealthRecord = (newRecord) => {
    setHealthRecords([...healthRecords, newRecord]);
  };

  const renderRecord = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('HealthRecordDetails', { record: item })}>
      <ListItem>
        <ListItemText>{item.type}: {item.description}</ListItemText>
        <ListItemText>Date: {item.date}</ListItemText>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Health Records</Text>
      <FlatList
        data={healthRecords}
        renderItem={renderRecord}
        keyExtractor={item => item.id}
      />
      <AddButton onPress={() => navigation.navigate('AddHealthRecord', { addRecord: addHealthRecord })}>
        <ButtonText>Add Health Record</ButtonText>
      </AddButton>
    </Container>
  );
}
