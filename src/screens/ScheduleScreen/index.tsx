import React, { useState, useContext } from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Container, AddButton, ButtonText, ListItem, ListItemText } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext'; // Importa o contexto do cachorro selecionado

export default function ScheduleScreen({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const { selectedDog } = useContext(DogProfileContext); // Obtém o cachorro selecionado do contexto

  // Função para carregar compromissos do AsyncStorage e filtrar por dogId
  const loadSchedules = async () => {
    try {
      const storedSchedules = await AsyncStorage.getItem('schedules');
      if (storedSchedules) {
        const allSchedules = JSON.parse(storedSchedules);
        // Filtra os compromissos pelo ID do cachorro selecionado
        const filteredSchedules = allSchedules.filter(schedule => schedule.dogId === selectedDog.id);
        setSchedules(filteredSchedules);
      }
    } catch (error) {
      console.error('Erro ao carregar compromissos', error);
    }
  };

  // useFocusEffect carrega os dados toda vez que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      if (selectedDog) {
        loadSchedules(); // Recarregar os compromissos ao focar na tela
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
      <Text style={{ fontSize: 24, marginBottom: 20 }}> Schedules {'for ' + selectedDog?.name}</Text>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={item => item.id}
      />
      <AddButton onPress={() => navigation.navigate('AddSchedule')}>
        <ButtonText>Add Schedule</ButtonText>
      </AddButton>
    </Container>
  );
}
