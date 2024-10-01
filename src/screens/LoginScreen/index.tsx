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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigation = useNavigation();

  // Função para validar formato de email
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    // Placeholder for actual login logic
    if (email && password) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }], 
      });
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  const handleRegister = () => {
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    Alert.alert('Registro bem-sucedido. Agora faça login.');
    setIsRegister(false); // Alterna para o modo login
  };

  return (
    <Container>
      <Title>{isRegister ? 'Registrar-se' : 'Login'}</Title>

      <Label>Email:</Label>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
      />

      <Label>Senha:</Label>
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
      />

      <CustomButton onPress={isRegister ? handleRegister : handleLogin}>
        <ButtonText>{isRegister ? 'Registrar' : 'Login'}</ButtonText>
      </CustomButton>

      <SwitchModeButton onPress={() => setIsRegister(!isRegister)}>
        <ButtonText>
          {isRegister ? 'Já tem uma conta? Faça login' : 'Criar uma nova conta'}
        </ButtonText>
      </SwitchModeButton>
    </Container>
  );
}
