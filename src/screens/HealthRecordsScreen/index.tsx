import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container } from "./styles";

export default function HealthRecordsScreen({ navigation }) {
  const [healthRecords, setHealthRecords] = useState([]);

  // Carregar registros do AsyncStorage quando a tela é montada
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

  // Função para adicionar um novo registro à lista local
  const addHealthRecord = (newRecord) => {
    setHealthRecords([...healthRecords, newRecord]);
  };

  const renderRecord = ({ item }) => (
    <TouchableOpacity
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}
      onPress={() => navigation.navigate('HealthRecordDetails', { record: item })}
    >
      <Text>{item.type}: {item.description}</Text>
      <Text>Data: {item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Registros de Saúde</Text>
      <FlatList
        data={healthRecords}
        renderItem={renderRecord}
        keyExtractor={item => item.id}
      />
      <Button
        title="Adicionar Registro de Saúde"
        onPress={() => navigation.navigate('AddHealthRecord', { addRecord: addHealthRecord })}
      />
    </Container>
  );
}
