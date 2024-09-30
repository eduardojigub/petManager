import React, { useState } from 'react';
import { Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Importing ImagePicker for photo selection
import { Container, Label, Input, SaveButton, ButtonText } from "./styles";

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState(null); // State to store the image

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

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSave = () => {
    console.log('Saving Profile:', { name, breed, age, weight, image });
    // Logic to save data (to local storage, API, etc.)
    navigation.goBack(); // Navigate back to the ProfileScreen
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

      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 20 }} />}

      <SaveButton onPress={handleSave}>
        <ButtonText>Save Profile</ButtonText>
      </SaveButton>
    </Container>
  );
}
