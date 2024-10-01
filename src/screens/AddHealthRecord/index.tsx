import React, { useState } from 'react';
import { Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Importa o ImagePicker
import { Container, Title, Input, CustomButton, ButtonText, ImagePreview } from "./styles";

export default function AddHealthRecordScreen({ navigation, route }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null); // Estado para armazenar a imagem

  // Função para selecionar uma imagem da galeria
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'Permissão para acessar a galeria é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Verificar se a seleção não foi cancelada e se há assets disponíveis
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri); // Armazena a URI da imagem no estado
    } else {
      console.log("Image selection was canceled or no assets available");
    }
  };

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
      image, // Adiciona a URI da imagem ao novo registro
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
      <Title>Adicionar Registro de Saúde</Title>

      <Input
        value={type}
        onChangeText={setType}
        placeholder="Ex: Vacina, Consulta"
      />

      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição do Registro"
      />

      <Input
        value={date}
        onChangeText={setDate}
        placeholder="Data (YYYY-MM-DD)"
      />

      {/* Botão para selecionar uma imagem */}
      <CustomButton onPress={pickImage}>
        <ButtonText>Selecionar Imagem</ButtonText>
      </CustomButton>

      {/* Exibir a imagem selecionada */}
      {image && <ImagePreview source={{ uri: image }} />}

      <CustomButton onPress={handleSave}>
        <ButtonText>Salvar</ButtonText>
      </CustomButton>
    </Container>
  );
}
