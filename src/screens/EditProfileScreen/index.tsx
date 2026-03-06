import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Camera } from 'phosphor-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../types/navigation';
import { useProfileForm } from './hooks/useProfileForm';
import ProfileFormFields from './components/ProfileFormFields';
import {
  ScrollContainer, ContentContainer, AvatarContainer, AvatarImage,
  AvatarPlaceholder, CameraIconBadge, SaveButton, ButtonText, DeleteButton,
} from './styles';

type Props = StackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation, route }: Props) {
  const form = useProfileForm(route.params);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollContainer>
          <ContentContainer>
            <AvatarContainer onPress={form.handlePickImage}>
              {form.image ? (
                <AvatarImage source={{ uri: form.image }} />
              ) : (
                <AvatarPlaceholder>
                  <Icon name="dog" size={44} color="#41245c" />
                </AvatarPlaceholder>
              )}
              <CameraIconBadge>
                <Camera size={16} color="#fff" weight="bold" />
              </CameraIconBadge>
            </AvatarContainer>

            <ProfileFormFields form={form} />

            <SaveButton onPress={() => form.handleSave(() => navigation.navigate('Profile'))} disabled={form.uploading}>
              {form.uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ButtonText>
                  {form.isNewProfile ? form.t('editPet.createProfile') : form.t('editPet.saveChanges')}
                </ButtonText>
              )}
            </SaveButton>

            {!form.isNewProfile && (
              <DeleteButton onPress={() => form.handleDelete(() => navigation.navigate('Profile'))}>
                <ButtonText>{form.t('editPet.deleteProfile')}</ButtonText>
              </DeleteButton>
            )}
          </ContentContainer>
        </ScrollContainer>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
