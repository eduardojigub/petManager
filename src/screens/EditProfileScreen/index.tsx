import React, { useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback, ActivityIndicator, View } from 'react-native';
import FormScreen from '../../components/FormScreen';
import { StackActions } from '@react-navigation/native';
import { Camera } from 'phosphor-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../types/navigation';
import { useProfileForm } from './hooks/useProfileForm';
import ProfileFormFields from './components/ProfileFormFields';
import {
  ContentContainer, AvatarContainer, AvatarImage,
  AvatarPlaceholder, CameraIconBadge, SaveButton, ButtonText, DeleteButton,
} from './styles';

type Props = StackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation, route }: Props) {
  const form = useProfileForm(route.params);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (form.leaveBlocked.current) event.preventDefault();
    });
    return unsubscribe;
  }, [navigation, form.leaveBlocked]);

  const finishDelete = () => {
    popOtherPetStacks(navigation);
    navigation.navigate('Profile');
  };

  return (
    <FormScreen backgroundColor="#f8f8f8">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

            <SaveButton
              onPress={() => form.handleSave(() => navigation.navigate('Profile'))}
              disabled={form.uploading || form.deleting}
            >
              {form.uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ButtonText>
                  {form.isNewProfile ? form.t('editPet.createProfile') : form.t('editPet.saveChanges')}
                </ButtonText>
              )}
            </SaveButton>

            {!form.isNewProfile && (
              <DeleteButton onPress={() => form.handleDelete(finishDelete)} disabled={form.deleting}>
                {form.deleting ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator color="#fff" />
                    <ButtonText style={{ marginLeft: 8 }}>{form.t('editPet.deleting')}</ButtonText>
                  </View>
                ) : (
                  <ButtonText>{form.t('editPet.deleteProfile')}</ButtonText>
                )}
              </DeleteButton>
            )}
          </ContentContainer>
      </TouchableWithoutFeedback>
    </FormScreen>
  );
}

function popOtherPetStacks(navigation: Props['navigation']): void {
  const parent = navigation.getParent();
  if (!parent) return;
  for (const route of parent.getState().routes) {
    if (route.name === 'ProfileTab' || route.name === 'Settings') continue;
    const nested = route.state;
    if (!nested?.key || !nested.index) continue;
    parent.dispatch({
      ...StackActions.popToTop(),
      target: nested.key,
    });
  }
}
