import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import { Container, ListItem, ListItemText, AddButton, ButtonText } from "./styles";
import { DogProfileContext } from '../../context/DogProfileContext'; // Import DogProfileContext

export default function HealthRecordsScreen({ navigation }) {
  const [healthRecords, setHealthRecords] = useState([]);
  const { selectedDog } = useContext(DogProfileContext); // Get the selected dog

  // Load records from AsyncStorage when the screen mounts
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const storedRecords = await AsyncStorage.getItem('healthRecords');
        if (storedRecords) {
          const allRecords = JSON.parse(storedRecords);
          // Filter records based on the selected dog's ID
          const filteredRecords = allRecords.filter(record => record.dogId === selectedDog.id);
          setHealthRecords(filteredRecords);
        }
      } catch (error) {
        console.error('Erro ao carregar registros de saúde', error);
      }
    };

    if (selectedDog) {
      loadRecords();
    }
  }, [selectedDog]);

  // Function to add a new health record to the local list
  const addHealthRecord = (newRecord) => {
    setHealthRecords([...healthRecords, newRecord]);
  };

  const renderRecord = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('HealthRecordDetails', { record: item })}>
      <ListItem>
        <ListItemText>{item.type}: {item.description}</ListItemText>
        <ListItemText>Data: {item.date}</ListItemText>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Registros de Saúde</Text>
      <FlatList
        data={healthRecords}
        renderItem={renderRecord}
        keyExtractor={item => item.id}
      />
      <AddButton onPress={() => navigation.navigate('AddHealthRecord', { addRecord: addHealthRecord })}>
        <ButtonText>Adicionar Registros de Saúde</ButtonText>
      </AddButton>
    </Container>
  );
}
