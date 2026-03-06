import React, { useState, useContext } from 'react';
import {
  Container,
  Title,
  InputContainer,
  Label,
  Input,
  Button,
  ButtonText,
  ErrorText,
} from './styles';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';

export default function AccountSettingsScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('password.allFieldsRequired'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('password.passwordsMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setError(t('password.passwordMin'));
      return;
    }

    try {
      const user = getAuth().currentUser;

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      Alert.alert(t('common.success'), t('password.updated'));
      navigation.goBack();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <Title>{t('password.title')}</Title>

      {error ? <ErrorText>{error}</ErrorText> : null}

      <InputContainer>
        <Label>{t('password.currentPassword')}</Label>
        <Input
          placeholder={t('password.currentPlaceholder')}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </InputContainer>

      <InputContainer>
        <Label>{t('password.newPassword')}</Label>
        <Input
          placeholder={t('password.newPlaceholder')}
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </InputContainer>

      <InputContainer>
        <Label>{t('password.confirmPassword')}</Label>
        <Input
          placeholder={t('password.confirmPlaceholder')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </InputContainer>

      <Button onPress={handleUpdatePassword}>
        <ButtonText>{t('password.updateButton')}</ButtonText>
      </Button>
    </Container>
  );
}
