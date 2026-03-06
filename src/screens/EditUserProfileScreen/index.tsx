import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { getAuth, updateProfile } from '@react-native-firebase/auth';
import { Camera } from 'phosphor-react-native';
import useImageUpload from '../../hooks/useImageUpload';
import {
  Container,
  AvatarContainer,
  AvatarImage,
  AvatarPlaceholder,
  AvatarPlaceholderText,
  CameraIconContainer,
  Label,
  Input,
  EmailText,
  SaveButton,
  SaveButtonText,
} from './styles';

export default function EditUserProfileScreen({ navigation }: any) {
  const auth = getAuth();
  const user = auth.currentUser;

  const userEmail = user?.email || '';
  const currentName = user?.displayName || userEmail.split('@')[0] || '';
  const currentPhoto = user?.photoURL || null;

  const [name, setName] = useState(currentName);
  const [photoURL, setPhotoURL] = useState<string | null>(currentPhoto);
  const [saving, setSaving] = useState(false);

  const { pickImage, uploadImage, uploading } = useImageUpload('userAvatars', {
    resize: true,
  });

  const userInitial = (name || currentName).charAt(0).toUpperCase();

  const handlePickPhoto = async () => {
    const uri = await pickImage();
    if (uri) {
      const downloadURL = await uploadImage(uri);
      if (downloadURL) {
        setPhotoURL(downloadURL);
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(auth.currentUser!, {
        displayName: name.trim(),
        photoURL: photoURL || undefined,
      });
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile.');
      console.warn('Update profile error:', error.message);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = name !== currentName || photoURL !== currentPhoto;

  return (
    <Container>
      <AvatarContainer onPress={handlePickPhoto} disabled={uploading}>
        {uploading ? (
          <AvatarPlaceholder>
            <ActivityIndicator size="large" color="#fff" />
          </AvatarPlaceholder>
        ) : photoURL ? (
          <AvatarImage source={{ uri: photoURL }} />
        ) : (
          <AvatarPlaceholder>
            <AvatarPlaceholderText>{userInitial}</AvatarPlaceholderText>
          </AvatarPlaceholder>
        )}
        <CameraIconContainer>
          <Camera size={16} color="#fff" weight="bold" />
        </CameraIconContainer>
      </AvatarContainer>

      <Label>Name</Label>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#ccc"
        autoCapitalize="words"
      />

      <Label>Email</Label>
      <EmailText>{userEmail}</EmailText>

      <SaveButton onPress={handleSave} disabled={!hasChanges || saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <SaveButtonText>Save</SaveButtonText>
        )}
      </SaveButton>
    </Container>
  );
}
