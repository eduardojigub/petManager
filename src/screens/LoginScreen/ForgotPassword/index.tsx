import React, { useState } from 'react';
import { auth } from '../../../firebase/auth';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  HeaderWrapper,
  HeaderTitle,
  HeaderSubtitle,
  InputContainer,
  Input,
  CustomButton,
  ButtonText
} from './styles';
import CustomAlert from '../../../components/GlobalAlert/GlobalAlert';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (!email) {
      setAlertTitle('Error');
      setAlertMessage('Please enter your email.');
      setAlertVisible(true);
      return;
    }

    try {
      await auth.sendPasswordResetEmail(email);
      setAlertTitle('Success');
      setAlertMessage('Password reset email has been sent.');
      setAlertVisible(true);
    } catch (error) {
      setAlertTitle('Error');
      setAlertMessage(error.message);
      setAlertVisible(true);
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <HeaderTitle>Forgot Password</HeaderTitle>
        <HeaderSubtitle>Enter the email address associated with your account.</HeaderSubtitle>
      </HeaderWrapper>

      <InputContainer>
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#7C7C7C"
        />
      </InputContainer>

      <CustomButton onPress={handlePasswordReset}>
        <ButtonText>Reset password</ButtonText>
      </CustomButton>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </Container>
  );
}
