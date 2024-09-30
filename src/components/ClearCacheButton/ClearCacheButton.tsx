import React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { ButtonContainer, ButtonText } from './styles'; // Importando os estilos

export default function ClearCacheButton() {
  const handleClearCache = async () => {
    try {
      // Limpar AsyncStorage
      await AsyncStorage.clear();

      // Exibir alerta confirmando a limpeza do cache
      Alert.alert('Cache Limpo', 'O cache foi limpo com sucesso! O app será reiniciado.');

      // Recarregar o aplicativo
      setTimeout(() => {
        Updates.reloadAsync(); // Aguarde um momento e então reinicie o app
      }, 1000); // Aguarda 1 segundo para exibir o alerta antes de recarregar
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao limpar o cache.');
    }
  };

  return (
    <ButtonContainer onPress={handleClearCache}>
      <ButtonText>Limpar Cache e Recarregar</ButtonText>
    </ButtonContainer>
  );
}
