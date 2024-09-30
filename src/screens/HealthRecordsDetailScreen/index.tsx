import React from 'react';
import { View, Text, Button } from 'react-native';
import { Container } from "./styles"; // Se você já tiver estilos globais

export default function HealthRecordDetailsScreen({ route, navigation }) {
  // Recebe o registro de saúde passado pela navegação
  const { record } = route.params;

  return (
    <Container>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        {record.type} Detalhes
      </Text>
      <Text style={{ fontSize: 18 }}>Descrição: {record.description}</Text>
      <Text style={{ fontSize: 18 }}>Data: {record.date}</Text>

      <Button
        title="Voltar"
        onPress={() => navigation.goBack()} // Volta para a tela anterior
      />
    </Container>
  );
}
