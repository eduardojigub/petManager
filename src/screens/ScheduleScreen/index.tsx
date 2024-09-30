import React, { useState } from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Importa useFocusEffect
import { Container, AddButton, ButtonText, ListItem, ListItemText } from './styles';

export default function ScheduleScreen({ navigation }) {
  const [schedules, setSchedules] = useState([]);

  // Função para carregar compromissos do AsyncStorage
  const loadSchedules = async () => {
    try {
      const storedSchedules = await AsyncStorage.getItem('schedules');
      if (storedSchedules) {
        setSchedules(JSON.parse(storedSchedules));
      }
    } catch (error) {
      console.error('Erro ao carregar compromissos', error);
    }
  };

  // useFocusEffect carrega os dados toda vez que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadSchedules(); // Recarregar os compromissos ao focar na tela
    }, [])
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
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Compromissos</Text>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={item => item.id}
      />
      <AddButton onPress={() => navigation.navigate('AddSchedule')}>
        <ButtonText>Adicionar Compromisso</ButtonText>
      </AddButton>
    </Container>
  );
}
