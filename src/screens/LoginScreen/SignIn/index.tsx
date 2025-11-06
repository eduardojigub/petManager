import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebase/auth';
import {
  Container,
  HeaderWrapper,
  HeaderTitle,
  HeaderSubtitle,
  InputContainer,
  Input,
  CustomButton,
  ButtonText,
  ForgotPasswordContainer,
  ForgotPasswordLink,
  SignUpLinkContainer,
  SignUpText,
  SignUpLink,
  TogglePasswordIconSignIn
} from './styles';
import CustomAlert from '../../../components/GlobalAlert/GlobalAlert';
import { Eye, EyeSlash } from 'phosphor-react-native'; // Import eye icons

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      showAlert('Error', 'Please enter a valid email.');
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }],
      });
    } catch (error) {
      showAlert('Login Error', error.message);
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <HeaderTitle>Welcome Back</HeaderTitle>
        <HeaderSubtitle>Please enter your credentials</HeaderSubtitle>
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

      <InputContainer>
        <Input
          placeholder="Enter your password"
          secureTextEntry={!showPassword} // Control visibility based on `showPassword`
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#7C7C7C"
        />
           <TogglePasswordIconSignIn onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Eye size={24} color="#7C7C7C" /> // Show eye icon
          ) : (
            <EyeSlash size={24} color="#7C7C7C" /> // Show eye-slash icon
          )}
        </TogglePasswordIconSignIn>
      </InputContainer>

      <ForgotPasswordContainer>
        <ForgotPasswordLink onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot Password?
        </ForgotPasswordLink>
      </ForgotPasswordContainer>

      <CustomButton onPress={handleSignIn}>
        <ButtonText>Login</ButtonText>
      </CustomButton>

      <SignUpLinkContainer>
        <SignUpText>
          Don’t have an account? <SignUpLink onPress={() => navigation.navigate('SignUp')}>Register</SignUpLink>
        </SignUpText>
      </SignUpLinkContainer>

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
