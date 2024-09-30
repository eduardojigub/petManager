import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container } from "./styles";

export default function AddHealthRecordScreen({ navigation, route }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSave = async () => {
    if (!type || !description || !date) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const newRecord = {
      id: Math.random().toString(), // Gera um ID único
      type,
      description,
      date,
    };

    try {
      // Recupera os registros existentes do AsyncStorage
      const storedRecords = await AsyncStorage.getItem('healthRecords');
      const currentRecords = storedRecords ? JSON.parse(storedRecords) : [];

      // Adiciona o novo registro à lista existente
      const updatedRecords = [...currentRecords, newRecord];

      // Salva os registros atualizados no AsyncStorage
      await AsyncStorage.setItem('healthRecords', JSON.stringify(updatedRecords));

      // Verifica se existe uma função callback para atualizar o estado
      if (route.params?.addRecord) {
        route.params.addRecord(newRecord); // Atualiza o estado local
      }

      // Volta para a tela anterior
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar o registro de saúde', error);
      Alert.alert('Erro', 'Não foi possível salvar o registro de saúde.');
    }
  };

  return (
    <Container>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Adicionar Registro de Saúde</Text>

      <Text>Tipo:</Text>
      <TextInput
        value={type}
        onChangeText={setType}
        placeholder="Ex: Vacina, Consulta"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Descrição:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição do Registro"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Data:</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="Data (YYYY-MM-DD)"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Salvar" onPress={handleSave} />
    </Container>
  );
}
