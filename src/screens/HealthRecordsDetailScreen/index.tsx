import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { Container } from "./styles";

export default function HealthRecordDetailsScreen({ route, navigation }) {
  const { record } = route.params; // Receive the health record passed via navigation

  return (
    <Container>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        {record.type} Details
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Description: {record.description}</Text>
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Date: {record.date}</Text>

      {/* Display the image if it exists */}
      {record.image ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>Image:</Text>
          <Image source={{ uri: record.image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
        </View>
      ) : (
        <Text style={{ fontSize: 16, marginTop: 20 }}>No image available</Text>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </Container>
  );
}
