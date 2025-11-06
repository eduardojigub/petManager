import React, { useState } from 'react';
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
import { auth } from '../../firebase/auth';
import { Alert } from 'react-native';

export default function AccountSettingsScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const user = auth.currentUser;

      // Reauthenticate user
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(credential);

      // Update password
      await user.updatePassword(newPassword);
      Alert.alert('Success', 'Password updated successfully.');
      navigation.goBack();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <Title>Update Password</Title>

      {error ? <ErrorText>{error}</ErrorText> : null}

      <InputContainer>
        <Label>Current Password</Label>
        <Input
          placeholder="Enter your current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </InputContainer>

      <InputContainer>
        <Label>New Password</Label>
        <Input
          placeholder="Enter your new password"
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </InputContainer>

      <InputContainer>
        <Label>Confirm New Password</Label>
        <Input
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </InputContainer>

      <Button onPress={handleUpdatePassword}>
        <ButtonText>Update Password</ButtonText>
      </Button>
    </Container>
  );
}
