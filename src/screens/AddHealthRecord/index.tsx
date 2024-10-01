import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Container, Title, Input, CustomButton, ButtonText, ImagePreview } from "./styles";
import { DogProfileContext } from '../../context/DogProfileContext';

export default function AddHealthRecordScreen({ navigation, route }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null); // State to store the image

  const { selectedDog } = useContext(DogProfileContext); // Get the selected dog

  // Function to select an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access the gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Check if the selection was not canceled and if assets are available
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri); // Store the image URI in the state
    } else {
      console.log("Image selection was canceled or no assets available");
    }
  };

  const handleSave = async () => {
    if (!type || !description || !date) {
      Alert.alert('Please fill out all fields');
      return;
    }

    const newRecord = {
      id: Math.random().toString(), // Generate a unique ID
      type,
      description,
      date,
      image, // Add the image URI to the new record
      dogId: selectedDog.id, // Attach dog ID to the record
    };

    try {
      // Retrieve existing records from AsyncStorage
      const storedRecords = await AsyncStorage.getItem('healthRecords');
      const currentRecords = storedRecords ? JSON.parse(storedRecords) : [];

      // Add the new record to the existing list
      const updatedRecords = [...currentRecords, newRecord];

      // Save the updated records to AsyncStorage
      await AsyncStorage.setItem('healthRecords', JSON.stringify(updatedRecords));

      // Check if a callback function exists to update the state
      if (route.params?.addRecord) {
        route.params.addRecord(newRecord); // Update the local state
      }

      // Go back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error('Error saving health record', error);
      Alert.alert('Error', 'Unable to save the health record.');
    }
  };

  return (
    <Container>
      <Title>Add Health Record</Title>

      <Input
        value={type}
        onChangeText={setType}
        placeholder="Ex: Vaccine, Consultation"
      />

      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Record Description"
      />

      <Input
        value={date}
        onChangeText={setDate}
        placeholder="Date (YYYY-MM-DD)"
      />

      {/* Button to select an image */}
      <CustomButton onPress={pickImage}>
        <ButtonText>Select Image</ButtonText>
      </CustomButton>

      {/* Display the selected image */}
      {image && <ImagePreview source={{ uri: image }} />}

      <CustomButton onPress={handleSave}>
        <ButtonText>Save</ButtonText>
      </CustomButton>
    </Container>
  );
}
