import React, { useContext, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { db } from '../../firebase/Firestore';
import { collection, addDoc, doc, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
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
import useImageUpload from '../../hooks/useImageUpload';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../types/navigation';
import { confirmDelete } from '../../utils/confirmDelete';

type Props = StackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation, route }: Props) {
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
  const { pickImage, uploadImage, uploading } = useImageUpload('dogProfiles', { resize: true });

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleSave = async () => {
    const userId = getAuth().currentUser?.uid;

    if (!userId || !name || !breed || !age || !weight) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    let imageUrl = image;

    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        Alert.alert('Error', 'Image upload failed. Cannot save the profile.');
        return;
      }
    }

    const profile = { name, breed, age, weight, image: imageUrl, userId };

    try {
      if (isNewProfile) {
        await addDoc(collection(db, 'dogProfiles'), profile);
      } else {
        await updateDoc(doc(db, 'dogProfiles', id), profile);
      }

      navigation.navigate('Profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleDelete = () => {
    confirmDelete({
      title: 'Delete Profile',
      message: 'Are you sure you want to delete this profile?',
      confirmText: 'OK',
      destructive: false,
      cancelable: false,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'dogProfiles', id));
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
    });
  };

  const handleInput = (input, setInput) => {
    const formattedInput = input.replace(/[^0-9.]/g, '');
    const validDecimal = formattedInput.split('.').length <= 2;

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
                  maxLength={20}
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
                  keyboardType="decimal-pad"
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
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <UnitText>kg</UnitText>
              </InputWithIcon>

              <AddPhotoButton onPress={handlePickImage}>
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
