import React, { useState, useEffect } from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, ListItem, ListItemText, AddButton, ButtonText } from "./styles";

export default function HealthRecordsScreen({ navigation }) {
  const [healthRecords, setHealthRecords] = useState([]);

  // Load records from AsyncStorage when the screen mounts
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const storedRecords = await AsyncStorage.getItem('healthRecords');
        if (storedRecords) {
          setHealthRecords(JSON.parse(storedRecords));
        }
      } catch (error) {
        console.error('Erro ao carregar registros de saúde', error);
      }
    };

    loadRecords();
  }, []);

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
