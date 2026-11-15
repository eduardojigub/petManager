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
  TogglePasswordIcon,
} from './styles';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import FormScreen from '../../components/FormScreen';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { LanguageContext } from '../../context/LanguageContext';

export default function AccountSettingsScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <FormScreen>
    <Container>
      <Title>{t('password.title')}</Title>

      {error ? <ErrorText>{error}</ErrorText> : null}

      <InputContainer>
        <Label>{t('password.currentPassword')}</Label>
        <Input
          placeholder={t('password.currentPlaceholder')}
          secureTextEntry={!showCurrentPassword}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TogglePasswordIcon onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
          {showCurrentPassword ? (
            <Eye size={24} color="#7C7C7C" />
          ) : (
            <EyeSlash size={24} color="#7C7C7C" />
          )}
        </TogglePasswordIcon>
      </InputContainer>

      <InputContainer>
        <Label>{t('password.newPassword')}</Label>
        <Input
          placeholder={t('password.newPlaceholder')}
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TogglePasswordIcon onPress={() => setShowNewPassword(!showNewPassword)}>
          {showNewPassword ? (
            <Eye size={24} color="#7C7C7C" />
          ) : (
            <EyeSlash size={24} color="#7C7C7C" />
          )}
        </TogglePasswordIcon>
      </InputContainer>

      <InputContainer>
        <Label>{t('password.confirmPassword')}</Label>
        <Input
          placeholder={t('password.confirmPlaceholder')}
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TogglePasswordIcon onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? (
            <Eye size={24} color="#7C7C7C" />
          ) : (
            <EyeSlash size={24} color="#7C7C7C" />
          )}
        </TogglePasswordIcon>
      </InputContainer>

      <Button onPress={handleUpdatePassword}>
        <ButtonText>{t('password.updateButton')}</ButtonText>
      </Button>
    </Container>
    </FormScreen>
  );
}
