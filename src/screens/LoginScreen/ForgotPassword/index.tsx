import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email has been sent.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
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
        <ButtonText>Proceed</ButtonText>
      </CustomButton>
    </Container>
  );
}
