import React, { useState, useContext } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
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
  const { t } = useContext(LanguageContext);
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
      Alert.alert(t('common.error'), t('editUser.nameEmpty'));
      return;
    }

    setSaving(true);
    try {
      await updateProfile(auth.currentUser!, {
        displayName: name.trim(),
        photoURL: photoURL || undefined,
      });
      Alert.alert(t('common.success'), t('editUser.profileUpdated'));
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(t('common.error'), t('editUser.failedUpdate'));
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

      <Label>{t('editUser.name')}</Label>
      <Input
        value={name}
        onChangeText={setName}
        placeholder={t('editUser.namePlaceholder')}
        placeholderTextColor="#ccc"
        autoCapitalize="words"
      />

      <Label>{t('editUser.email')}</Label>
      <EmailText>{userEmail}</EmailText>

      <SaveButton onPress={handleSave} disabled={!hasChanges || saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <SaveButtonText>{t('editUser.save')}</SaveButtonText>
        )}
      </SaveButton>
    </Container>
  );
}
