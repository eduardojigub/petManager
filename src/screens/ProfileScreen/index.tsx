import React from 'react';
import { Image, Button, Text, View } from 'react-native';
import { Container, Label } from "./styles";

export default function ProfileScreen({ navigation }) {
  // For now, we hardcode the values (later, they will come from a backend or state management)
  const name = 'Max';
  const breed = 'Labrador';
  const age = '3';
  const weight = '30kg';
  const image = 'https://www.purina.co.uk/sites/default/files/styles/square_medium_440x440/public/2022-07/Maltipoo-image-1.jpg?h=2018fa41&itok=10K7QrPK'; // Replace with your stored image URL

  return (
    <Container>
      {/* Display Dog Profile Data */}
      <Label>Dog's Profile</Label>
      <View>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 20 }} />}
        <Text>Name: {name}</Text>
        <Text>Breed: {breed}</Text>
        <Text>Age: {age} years</Text>
        <Text>Weight: {weight}</Text>
      </View>

      {/* Navigate to Edit Profile */}
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
      />
    </Container>
  );
}
