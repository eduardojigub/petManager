import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Container, ListItem, ListItemText, AddButton, ButtonText } from "./styles";
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore'; // Firestore import
import Feather from '@expo/vector-icons/Feather';

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

   // Function to delete a health record
   const deleteHealthRecord = async (id) => {
    try {
      await db.collection('healthRecords').doc(id).delete();
      setHealthRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
      Alert.alert('Success', 'Health record deleted successfully');
    } catch (error) {
      console.error('Error deleting health record', error);
      Alert.alert('Error', 'Failed to delete health record');
    }
  };

  const renderRecord = ({ item }) => (
    <ListItem>
      <TouchableOpacity onPress={() => navigation.navigate('HealthRecordDetails', { record: item })} style={{ flex: 1 }}>
        <ListItemText>{item.type}: {item.description}</ListItemText>
        <ListItemText>Date: {item.date}</ListItemText>
      </TouchableOpacity>
      {/* Trash can icon */}
      <TouchableOpacity onPress={() => deleteHealthRecord(item.id)}>
        <Feather name="trash" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </ListItem>
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
