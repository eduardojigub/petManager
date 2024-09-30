import React, { useState } from 'react';
import { Image, Button, Alert, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Label, Input, SaveButton, ButtonText } from "./styles";

export default function EditProfileScreen({ navigation, route }) {
  const { name: initialName, breed: initialBreed, age: initialAge, weight: initialWeight, image: initialImage } = route.params || {};

  const [name, setName] = useState(initialName || '');
  const [breed, setBreed] = useState(initialBreed || '');
  const [age, setAge] = useState(initialAge || '');
  const [weight, setWeight] = useState(initialWeight || '');
  const [image, setImage] = useState(initialImage || null);

  // Function to select an image from the gallery
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission needed", "Permission to access the gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


// Verificar se a seleção não foi cancelada e se há assets disponíveis
if (!result.canceled && result.assets && result.assets.length > 0) {
  const selectedImageUri = result.assets[0].uri; // Acessa a URI correta
  setImage(selectedImageUri); // Armazena a URI da imagem no estado
} else {
  console.log("Image selection was canceled or no assets available");
}
};

  const handleSave = async () => {
    // Profile data to be saved
    const profile = { name, breed, age, weight, image };

    try {
      // Save profile to AsyncStorage
      await AsyncStorage.setItem('dogProfile', JSON.stringify(profile));

      // Navigate back to ProfileScreen with updated data
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <Container>
      <Label>Edit Dog's Profile</Label>

      <Label>Dog's Name</Label>
      <Input value={name} onChangeText={setName} placeholder="Enter dog's name" />

      <Label>Breed</Label>
      <Input value={breed} onChangeText={setBreed} placeholder="Enter breed" />

      <Label>Age</Label>
      <Input value={age} onChangeText={setAge} placeholder="Enter age" keyboardType="numeric" />

      <Label>Weight</Label>
      <Input value={weight} onChangeText={setWeight} placeholder="Enter weight" keyboardType="numeric" />

      <Button title="Add a Photo" onPress={pickImage} />

      {/* Preview the uploaded image */}
      {image ? (
        <View>
          <Text>Preview:</Text>
          <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 20 }} />
        </View>
      ) : (
        <Text>No image selected</Text>
      )}

      <SaveButton onPress={handleSave}>
        <ButtonText>Save Profile</ButtonText>
      </SaveButton>
    </Container>
  );
}
