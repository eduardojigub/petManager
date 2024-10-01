import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Title,
  Label,
  Input,
  CustomButton,
  ButtonText,
  SwitchModeButton
} from './styles';
import auth from '@react-native-firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigation = useNavigation();

  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }],
      });
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Registration successful. Please log in.');
      setIsRegister(false); // Switch to login mode
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <Container>
      <Title>{isRegister ? 'Register' : 'Login'}</Title>

      <Label>Email:</Label>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />

      <Label>Password:</Label>
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      <CustomButton onPress={isRegister ? handleRegister : handleLogin}>
        <ButtonText>{isRegister ? 'Register' : 'Login'}</ButtonText>
      </CustomButton>

      <SwitchModeButton onPress={() => setIsRegister(!isRegister)}>
        <ButtonText>
          {isRegister ? 'Already have an account? Login' : 'Create a new account'}
        </ButtonText>
      </SwitchModeButton>
    </Container>
  );
}
