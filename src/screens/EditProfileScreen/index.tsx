import React, { useContext, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // Import ImageManipulator
import { db } from '../../firebase/Firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {
  Container,
  Label,
  IconInput,
  SaveButton,
  ButtonText,
  NoImageText,
  AddPhotoButton,
  ScrollContainer,
  DeleteButton,
  FormContainer,
  BannerImageBackground,
  InputWithIcon,
  UnitText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import * as Icon from 'phosphor-react-native';

export default function EditProfileScreen({ navigation, route }) {
  const {
    id,
    name: initialName,
    breed: initialBreed,
    age: initialAge,
    weight: initialWeight,
    image: initialImage,
  } = route.params || {};
  const isNewProfile = !id;
  const { setSelectedDog } = useContext(DogProfileContext);

  const [name, setName] = useState(initialName || '');
  const [breed, setBreed] = useState(initialBreed || '');
  const [age, setAge] = useState(initialAge || '');
  const [weight, setWeight] = useState(initialWeight || '');
  const [image, setImage] = useState(initialImage || null);
  const [uploading, setUploading] = useState(false);

  // Function to resize the image before uploading
  const resizeImage = async (imageUri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }], // Resize to width of 800px, maintaining aspect ratio
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Medium compression
      );
      return manipulatedImage.uri; // Return the resized image URI
    } catch (error) {
      console.error('Error resizing image:', error);
      Alert.alert('Error', 'Failed to resize image.');
      return null;
    }
  };

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission needed',
        'Permission to access the gallery is required!'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const resizedUri = await resizeImage(result.assets[0].uri); // Resize image before setting it
      setImage(resizedUri); // Set resized image
    } else {
      console.log('Image selection was canceled or no assets available');
    }
  };

  const uploadImageToStorage = async (imageUri) => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
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

  const handleDelete = () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this profile?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete canceled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await db.collection('dogProfiles').doc(id).delete();
              setSelectedDog(null);
              Alert.alert(
                'Profile Deleted',
                'The profile has been successfully deleted.'
              );
              navigation.navigate('Profile');
            } catch (error) {
              console.error('Failed to delete profile:', error);
              Alert.alert('Error', 'Failed to delete profile');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleInput = (input, setInput) => {
    // Allow numbers and a single decimal point
    const formattedInput = input.replace(/[^0-9.]/g, ''); // Remove non-numeric and extra characters
    const validDecimal = formattedInput.split('.').length <= 2; // Ensure only one decimal point exists

    if (validDecimal) {
      setInput(formattedInput);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollContainer>
          <BannerImageBackground source={image ? { uri: image } : null}>
            {!image && <NoImageText>No image selected</NoImageText>}
          </BannerImageBackground>

          <FormContainer>
            <Container>
              <Label>
                {isNewProfile ? 'Add New Pet Profile' : "Edit Pet's Profile"}
              </Label>

              <InputWithIcon>
                <Icon.Dog size={24} color="#666" />
                <IconInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter pet name"
                  maxLength={20} // Enforces a maximum of 20 characters
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </InputWithIcon>

              <InputWithIcon>
                <Icon.PawPrint size={24} color="#666" />
                <IconInput
                  value={breed}
                  onChangeText={setBreed}
                  placeholder="Enter breed"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </InputWithIcon>

              <InputWithIcon>
                <Icon.Cake size={24} color="#666" />
                <IconInput
                  value={age}
                  onChangeText={(text) => handleInput(text, setAge)}
                  placeholder="Enter age (e.g., 0.5 for 6 months, 1.6 for 1 year 6 months)"
                  keyboardType="decimal-pad" // Allows decimal input
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <UnitText>years</UnitText>
              </InputWithIcon>

              <InputWithIcon>
                <Icon.Scales size={24} color="#666" />
                <IconInput
                  value={weight}
                  onChangeText={(text) => handleInput(text, setWeight)}
                  placeholder="Enter weight (kg), Ex: 5kg"
                  keyboardType="decimal-pad" // Allows decimal input
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <UnitText>kg</UnitText>
              </InputWithIcon>

              <AddPhotoButton onPress={pickImage}>
                <ButtonText>
                  {image ? 'Change Photo' : 'Add a Photo'}
                </ButtonText>
              </AddPhotoButton>

              <SaveButton onPress={handleSave} disabled={uploading}>
                <ButtonText>
                  {uploading
                    ? 'Uploading...'
                    : isNewProfile
                    ? 'Create Profile'
                    : 'Save Changes'}
                </ButtonText>
              </SaveButton>

              {!isNewProfile && (
                <DeleteButton onPress={handleDelete}>
                  <ButtonText>Delete Profile</ButtonText>
                </DeleteButton>
              )}
            </Container>
          </FormContainer>
        </ScrollContainer>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
