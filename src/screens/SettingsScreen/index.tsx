import React from 'react';
import { View, Text } from 'react-native';
import ClearCacheButton from '../../components/ClearCacheButton'; 

export default function SettingsScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Configurações</Text>
      
      {/* Adiciona o botão de limpar cache */}
      <ClearCacheButton />
    </View>
  );
}
