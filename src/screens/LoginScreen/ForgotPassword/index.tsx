import React from 'react';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../../../hooks/useAlert';
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
  const [email, setEmail] = React.useState('');
  const { alertVisible, alertTitle, alertMessage, showAlert, hideAlert } = useAlert();
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (!email) {
      showAlert('Error', 'Please enter your email.');
      return;
    }

    try {
      await sendPasswordResetEmail(getAuth(), email);
      showAlert('Success', 'Password reset email has been sent.');
    } catch (error) {
      showAlert('Error', error.message);
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
        onClose={hideAlert}
        title={alertTitle}
        message={alertMessage}
      />
    </Container>
  );
}
