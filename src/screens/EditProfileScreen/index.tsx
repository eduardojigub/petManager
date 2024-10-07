import React, { useContext, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../firebase/Firestore'; // Import Firestore
import storage from '@react-native-firebase/storage'; // Import Firebase Storage
import { Container, Label, Input, SaveButton, ButtonText, ImagePreview, NoImageText, AddPhotoButton, ScrollContainer, DeleteButton } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';

export default function EditProfileScreen({ navigation, route }) {
  const { id, name: initialName, breed: initialBreed, age: initialAge, weight: initialWeight, image: initialImage } = route.params || {};

  const isNewProfile = !id;

  const { setSelectedDog } = useContext(DogProfileContext); // Get the selected dog

  const [name, setName] = useState(initialName || '');
  const [breed, setBreed] = useState(initialBreed || '');
  const [age, setAge] = useState(initialAge || '');
  const [weight, setWeight] = useState(initialWeight || '');
  const [image, setImage] = useState(initialImage || null);
  const [uploading, setUploading] = useState(false); // Track upload status

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
      setImage(result.assets[0].uri); // Set the image URI locally
    } else {
      console.log('Image selection was canceled or no assets available');
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImageToStorage = async (imageUri) => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri; // Remove 'file://' for iOS
    const storageRef = storage().ref(`dogProfiles/${filename}`); // Reference to Firebase Storage path

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
    if (!name || !breed || !age || !weight) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    let imageUrl = image;

    // Upload the image if it exists and has not already been uploaded
    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImageToStorage(image); // Upload the image to Firebase Storage
      if (!imageUrl) {
        Alert.alert('Error', 'Image upload failed. Cannot save the profile.');
        return; // Exit if image upload fails
      }
    }

    const profile = { name, breed, age, weight, image: imageUrl }; // Store the image URL in Firestore

    try {
      if (isNewProfile) {
        // Create a new profile in Firestore
        await db.collection('dogProfiles').add(profile);
      } else {
        // Update existing profile in Firestore
        await db.collection('dogProfiles').doc(id).update(profile);
      }

      navigation.navigate('Profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  // Delete profile from Firestore
  const handleDelete = async () => {
    try {
      await db.collection('dogProfiles').doc(id).delete();
      // Clear all related state data after deletion
      setSelectedDog(null); // Reset the selected dog
      Alert.alert('Profile Deleted', 'The profile has been successfully deleted.');
      navigation.navigate('Profile'); // Navigate back to the Profile screen
    } catch (error) {
      console.error('Failed to delete profile:', error);
      Alert.alert('Error', 'Failed to delete profile');
    }
  };

  return (
    <ScrollContainer>
      <Container>
        <Label>{isNewProfile ? "Add New Dog Profile" : "Edit Dog's Profile"}</Label>

        {image ? (
          <ImagePreview source={{ uri: image }} />
        ) : (
          <NoImageText>No image selected</NoImageText>
        )}

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

        <SaveButton onPress={handleSave} disabled={uploading}>
          <ButtonText>{uploading ? "Uploading..." : isNewProfile ? "Create Profile" : "Save Changes"}</ButtonText>
        </SaveButton>

         {/* Conditionally show the Delete Profile button for existing profiles */}
         {!isNewProfile && (
          <DeleteButton onPress={handleDelete}>
            <ButtonText>Delete Profile</ButtonText>
          </DeleteButton>
        )}
      </Container>
    </ScrollContainer>
  );
}
