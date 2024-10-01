import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { Container } from "./styles"; // Se você já tiver estilos globais

export default function HealthRecordDetailsScreen({ route, navigation }) {
  // Recebe o registro de saúde passado pela navegação
  const { record } = route.params;

  return (
    <Container>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        {record.type} Detalhes
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Descrição: {record.description}</Text>
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Data: {record.date}</Text>

      {/* Exibe a imagem se ela existir */}
      {record.image ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>Imagem:</Text>
          <Image
            source={{ uri: record.image }}
            style={{ width: 200, height: 200, marginBottom: 10 }}
          />
        </View>
      ) : (
        <Text style={{ fontSize: 16, marginTop: 20 }}>Nenhuma imagem disponível</Text>
      )}

      <Button
        title="Voltar"
        onPress={() => navigation.goBack()} // Volta para a tela anterior
      />
    </Container>
  );
}
