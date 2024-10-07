import React, { useContext, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Container, Title, Input, CustomButton, ButtonText, ImagePreview } from "./styles";
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore'; // Firestore import
import storage from '@react-native-firebase/storage'; // Firebase Storage import

export default function AddHealthRecordScreen({ navigation, route }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null); // State to store the image URI
  const [uploading, setUploading] = useState(false); // Track upload status

  const { selectedDog } = useContext(DogProfileContext); // Get the selected dog

  // Function to select an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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
      setImage(result.assets[0].uri); // Store selected image URI
    } else {
      console.log("Image selection was canceled or no assets available");
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImageToStorage = async (imageUri) => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
    const storageRef = storage().ref(`healthRecords/${filename}`); // Reference to Firebase Storage path

    setUploading(true); // Show uploading state

    try {
      await storageRef.putFile(uploadUri); // Upload the file to Firebase Storage
      const downloadURL = await storageRef.getDownloadURL(); // Get the download URL
      setUploading(false); // Hide uploading state
      return downloadURL; // Return the URL to store in Firestore
    } catch (error) {
      setUploading(false); // Hide uploading state
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
      return null;
    }
  };

  const handleSave = async () => {
    if (!type || !description || !date) {
      Alert.alert('Please fill out all fields');
      return;
    }

    let imageUrl = image;

    // Upload the image if it exists and has not already been uploaded
    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImageToStorage(image); // Upload the image to Firebase Storage
      if (!imageUrl) {
        Alert.alert('Error', 'Image upload failed. Cannot save the health record.');
        return; // Exit if image upload fails
      }
    }

    const newRecord = {
      type,
      description,
      date,
      image: imageUrl, // Store the image URL in Firestore
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

      <CustomButton onPress={handleSave} disabled={uploading}>
        <ButtonText>{uploading ? 'Uploading...' : 'Save'}</ButtonText>
      </CustomButton>
    </Container>
  );
}
