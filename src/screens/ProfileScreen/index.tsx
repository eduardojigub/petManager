import React, { useState } from 'react';
import { Image, Button, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Container, Label } from "./styles";

export default function ProfileScreen({ navigation }) {
  const [dogProfile, setDogProfile] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    image: null,
  });

  // Re-fetch profile from AsyncStorage when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const storedProfile = await AsyncStorage.getItem('dogProfile');
          if (storedProfile) {
            setDogProfile(JSON.parse(storedProfile));
          }
        } catch (error) {
          console.error('Failed to load dog profile:', error);
        }
      };

      loadProfile();
    }, [])
  );

  const { name, breed, age, weight, image } = dogProfile;

  // Função para limpar o cache
  const clearCache = async () => {
    try {
      await AsyncStorage.clear();
      setDogProfile({
        name: '',
        breed: '',
        age: '',
        weight: '',
        image: null,
      });
      Alert.alert('Cache limpo', 'Todos os dados foram removidos.');
    } catch (error) {
      console.error('Failed to clear the cache:', error);
      Alert.alert('Erro', 'Não foi possível limpar o cache.');
    }
  };

  return (
    <Container>
      {name || breed || age || weight ? (
        <>
          <Label>Dog's Profile</Label>
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 20 }} />}
          <Text>Name: {name}</Text>
          <Text>Breed: {breed}</Text>
          <Text>Age: {age} years</Text>
          <Text>Weight: {weight}</Text>

          {/* Botão para editar o perfil */}
          <Button
            title="Edit Dog Profile"
            onPress={() => navigation.navigate('EditProfile', dogProfile)}
          />
        </>
      ) : (
        <View>
          <Text>No dog data available. Please add your dog's profile.</Text>
          <Button
            title="Add Dog Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
        </View>
      )}

      {/* Botão de limpar cache */}
      <Button
        title="Limpar Cache"
        color="red"
        onPress={clearCache}
      />
    </Container>
  );
}
