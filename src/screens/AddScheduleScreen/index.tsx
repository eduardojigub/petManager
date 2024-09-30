import React, { useState } from 'react';
import { TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Container, ButtonText, AddButton } from './styles';

export default function AddScheduleScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Erro', 'A descrição do compromisso não pode estar vazia.');
      return;
    }

    const newSchedule = {
      id: Math.random().toString(),
      description,
      date: date.toLocaleDateString(),
      time: time.toLocaleTimeString(),
    };

    try {
      const storedSchedules = await AsyncStorage.getItem('schedules');
      const currentSchedules = storedSchedules ? JSON.parse(storedSchedules) : [];
      const updatedSchedules = [...currentSchedules, newSchedule];

      await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));

      // Agendar notificação para o horário do compromisso
      const notificationDate = new Date(date);
      notificationDate.setHours(time.getHours());
      notificationDate.setMinutes(time.getMinutes());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Compromisso',
          body: `Compromisso: ${description}`,
          sound: true,
        },
        trigger: notificationDate, // O horário que a notificação deve ser disparada
      });

      Alert.alert('Sucesso', 'Compromisso salvo com sucesso e notificação agendada!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar compromisso', error);
    }
  };

  return (
    <Container>
      <TextInput
        placeholder="Descrição do Compromisso"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
      />
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => setDate(selectedDate || date)}
      />
      <DateTimePicker
        value={time}
        mode="time"
        display="default"
        onChange={(event, selectedTime) => setTime(selectedTime || time)}
      />
      <AddButton onPress={handleSave}>
        <ButtonText>Salvar Compromisso</ButtonText>
      </AddButton>
    </Container>
  );
}
