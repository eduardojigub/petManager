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
  TogglePasswordIcon
} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
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
      <CustomButton onPress={handleSignUp}>
        <ButtonText>Sign Up</ButtonText>
      </CustomButton>
    </Container>
  );
}
