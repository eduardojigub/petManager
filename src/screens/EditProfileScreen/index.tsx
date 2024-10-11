import React, { useContext, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../firebase/Firestore'; // Import Firestore
import storage from '@react-native-firebase/storage'; // Import Firebase Storage
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import { Container, Label, Input, SaveButton, ButtonText, NoImageText, AddPhotoButton, ScrollContainer, DeleteButton, FormContainer, BannerImageBackground } from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';

export default function EditProfileScreen({ navigation, route }) {
  const { id, name: initialName, breed: initialBreed, age: initialAge, weight: initialWeight, image: initialImage } = route.params || {};
  const isNewProfile = !id;
  const { setSelectedDog } = useContext(DogProfileContext);

  const [name, setName] = useState(initialName || '');
  const [breed, setBreed] = useState(initialBreed || '');
  const [age, setAge] = useState(initialAge || '');
  const [weight, setWeight] = useState(initialWeight || '');
  const [image, setImage] = useState(initialImage || null);
  const [uploading, setUploading] = useState(false);

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

  const uploadImageToStorage = async (imageUri) => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
    const storageRef = storage().ref(`dogProfiles/${filename}`);

    setUploading(true);

    try {
      await storageRef.putFile(uploadUri);
      const downloadURL = await storageRef.getDownloadURL();
      setUploading(false);
      return downloadURL;
    } catch (error) {
      setUploading(false);
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
      return null;
    }
  };

  const handleSave = async () => {
    const userId = auth().currentUser?.uid;

    if (!userId || !name || !breed || !age || !weight) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    let imageUrl = image;

    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImageToStorage(image);
      if (!imageUrl) {
        Alert.alert('Error', 'Image upload failed. Cannot save the profile.');
        return;
      }
    }

    const profile = { name, breed, age, weight, image: imageUrl, userId };

    try {
      if (isNewProfile) {
        await db.collection('dogProfiles').add(profile);
      } else {
        await db.collection('dogProfiles').doc(id).update(profile);
      }

      navigation.navigate('Profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleDelete = async () => {
    try {
      await db.collection('dogProfiles').doc(id).delete();
      setSelectedDog(null);
      Alert.alert('Profile Deleted', 'The profile has been successfully deleted.');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Failed to delete profile:', error);
      Alert.alert('Error', 'Failed to delete profile');
    }
  };

  return (
    <ScrollContainer>
      {/* Banner image background */}
      <BannerImageBackground source={{ uri: image || '' }}>
        {!image && <NoImageText>No image selected</NoImageText>}
      </BannerImageBackground>

      <FormContainer>
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

          <SaveButton onPress={handleSave} disabled={uploading}>
            <ButtonText>{uploading ? "Uploading..." : isNewProfile ? "Create Profile" : "Save Changes"}</ButtonText>
          </SaveButton>

          {!isNewProfile && (
            <DeleteButton onPress={handleDelete}>
              <ButtonText>Delete Profile</ButtonText>
            </DeleteButton>
          )}
        </Container>
      </FormContainer>
    </ScrollContainer>
  );
}