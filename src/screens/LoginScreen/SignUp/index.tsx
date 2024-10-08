import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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


export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    if (!agree) {
      Alert.alert('Error', 'You must agree to the terms & conditions.');
      return;
    }
    navigation.navigate('Initial'); // Redirect back to initial screen after signing up
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
        {/* Checkbox for terms & conditions */}
        <CheckboxContainer>
        <CheckBox
          value={agree}
          onValueChange={setAgree}
          tintColors={{ true: '#41245C', false: '#7C7C7C' }}
        />
        <CheckboxLabel>I agree with terms & conditions</CheckboxLabel>
      </CheckboxContainer>

      <CustomButton onPress={handleSignUp}>
        <ButtonText>Sign Up</ButtonText>
      </CustomButton>

      <SignInLinkContainer>
        <SignInText>Already have an account? <SignInLink onPress={() => navigation.navigate('SignIn')}>Sign In</SignInLink></SignInText>
      </SignInLinkContainer>
    </Container>
  );
}
