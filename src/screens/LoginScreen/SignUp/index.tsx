import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {
  Container,
  HeaderWrapper,
  HeaderTitle,
  HeaderSubtitle,
  InputContainer,
  Label,
  Input,
  CustomButton,
  ButtonText,
  TogglePasswordIcon,
  CheckboxContainer,
  SignInLinkContainer,
  SignInText,
  SignInLink,
  CheckboxLabel
} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import CustomAlert from '../../../components/GlobalAlert/GlobalAlert';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Error', 'All fields are required.');
      return;
    }
    if (password.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    if (!agree) {
      showAlert('Error', 'You must agree to the terms & conditions.');
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      navigation.navigate('Initial'); // Redirect back to initial screen after signing up
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showAlert('Error', 'Email already registered');
      } else {
        showAlert('Error', error.message);
      }
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <HeaderTitle>Welcome</HeaderTitle>
        <HeaderSubtitle>Please enter your account here</HeaderSubtitle>
      </HeaderWrapper>

      <InputContainer>
        <Label>Email</Label>
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
        <Label>Password</Label>
        <Input
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#7C7C7C"
        />
        <TogglePasswordIcon onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#7C7C7C" />
        </TogglePasswordIcon>
      </InputContainer>

      <CheckboxContainer>
        <CheckBox
          value={agree}
          onValueChange={setAgree}
          tintColors={{ true: '#41245C', false: '#7C7C7C' }}
        />
        <CheckboxLabel>I agree with terms & conditions</CheckboxLabel>
      </CheckboxContainer>

      <CustomButton onPress={handleSignUp}>
        <ButtonText>Register</ButtonText>
      </CustomButton>

      <SignInLinkContainer>
        <SignInText>Already have an account? <SignInLink onPress={() => navigation.navigate('SignIn')}>Login</SignInLink></SignInText>
      </SignInLinkContainer>

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
