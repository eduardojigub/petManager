import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Container, Title, Input, CustomButton, ButtonText, ImagePreview } from "./styles";
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore'; // Firestore import

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
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
      type,
      description,
      date,
      image,
      dogId: selectedDog.id, // Attach the selected dog's ID
    };

    try {
      // Save the new health record to Firestore
      await db.collection('healthRecords').add(newRecord);
      
      if (route.params?.addRecord) {
        route.params.addRecord(newRecord);
      }

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
