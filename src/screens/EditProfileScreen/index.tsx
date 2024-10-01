import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Label, Input, SaveButton, ButtonText, ImagePreview, NoImageText, AddPhotoButton, ScrollContainer } from './styles';

export default function EditProfileScreen({ navigation, route }) {
  const { id, name: initialName, breed: initialBreed, age: initialAge, weight: initialWeight, image: initialImage } = route.params || {};

  // If there is no `id`, it means this is a new profile being created
  const isNewProfile = !id;

  const [name, setName] = useState(initialName || '');
  const [breed, setBreed] = useState(initialBreed || '');
  const [age, setAge] = useState(initialAge || '');
  const [weight, setWeight] = useState(initialWeight || '');
  const [image, setImage] = useState(initialImage || null);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Permission to access the gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      console.log('Image selection was canceled or no assets available');
    }
  };

  const handleSave = async () => {
    if (!name || !breed || !age || !weight) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    // Prepare the profile object (either new or updated)
    const profile = { 
      id: id || Math.random().toString(), // Generate new id if it's a new profile
      name, 
      breed, 
      age, 
      weight, 
      image 
    };

    try {
      // Retrieve existing profiles from AsyncStorage
      const storedProfiles = await AsyncStorage.getItem('dogProfiles');
      const profiles = storedProfiles ? JSON.parse(storedProfiles) : [];

      if (isNewProfile) {
        // If it's a new profile, add it to the list
        profiles.push(profile);
      } else {
        // If it's an existing profile, find it and update it
        const profileIndex = profiles.findIndex(p => p.id === id);
        if (profileIndex !== -1) {
          profiles[profileIndex] = profile; // Update the existing profile
        }
      }

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem('dogProfiles', JSON.stringify(profiles));

      // Navigate back to the ProfileScreen
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <ScrollContainer>
      <Container>
        <Label>{isNewProfile ? "Add New Dog Profile" : "Edit Dog's Profile"}</Label>

        <Label>Dog's Name</Label>
        <Input value={name} onChangeText={setName} placeholder="Enter dog's name" />

        <Label>Breed</Label>
        <Input value={breed} onChangeText={setBreed} placeholder="Enter breed" />

        <Label>Age</Label>
        <Input value={age} onChangeText={setAge} placeholder="Enter age" keyboardType="numeric" />

        <Label>Weight (kg)</Label>
        <Input value={weight} onChangeText={setWeight} placeholder="Enter weight" keyboardType="numeric" />

        <AddPhotoButton onPress={pickImage}>
          <ButtonText>{image ? "Change Photo" : "Add a Photo"}</ButtonText>
        </AddPhotoButton>

        {image ? (
          <ImagePreview source={{ uri: image }} />
        ) : (
          <NoImageText>No image selected</NoImageText>
        )}

        <SaveButton onPress={handleSave}>
          <ButtonText>{isNewProfile ? "Create Profile" : "Save Changes"}</ButtonText>
        </SaveButton>
      </Container>
    </ScrollContainer>
  );
}
