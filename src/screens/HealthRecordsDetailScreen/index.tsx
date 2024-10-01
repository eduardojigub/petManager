import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { Container } from "./styles";

export default function HealthRecordDetailsScreen({ route, navigation }) {
  const { record } = route.params;

  return (
    <Container>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        {record.type} Detalhes
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Descrição: {record.description}</Text>
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Data: {record.date}</Text>

      {record.image ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>Imagem:</Text>
          <Image source={{ uri: record.image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
        </View>
      ) : (
        <Text style={{ fontSize: 16, marginTop: 20 }}>Nenhuma imagem disponível</Text>
      )}

      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </Container>
  );
}

