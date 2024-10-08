import React from 'react';
import { Container, Title, Button, ButtonText } from './styles';
import { useNavigation } from '@react-navigation/native';

export default function InitialScreen() {
  const navigation = useNavigation();

  return (
    <Container>
      <Title>Welcome to the App</Title>
      <Button onPress={() => navigation.navigate('SignIn')}>
        <ButtonText>Sign In</ButtonText>
      </Button>
      <Button onPress={() => navigation.navigate('SignUp')}>
        <ButtonText>Sign Up</ButtonText>
      </Button>
    </Container>
  );
}
