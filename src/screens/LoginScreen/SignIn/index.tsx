import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { useAlert } from '../../../hooks/useAlert';
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
  ForgotPasswordContainer,
  ForgotPasswordLink,
  SignUpLinkContainer,
  SignUpText,
  SignUpLink,
  TogglePasswordIconSignIn
} from './styles';
import CustomAlert from '../../../components/GlobalAlert/GlobalAlert';
import { Eye, EyeSlash } from 'phosphor-react-native'; // Import eye icons
import { LanguageContext } from '../../../context/LanguageContext';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { alertVisible, alertTitle, alertMessage, showAlert, hideAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      showAlert(t('common.error'), t('signIn.invalidEmail'));
      return;
    }

    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }],
      });
    } catch (error) {
      showAlert(t('signIn.loginError'), error.message);
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <HeaderTitle>{t('signIn.welcomeBack')}</HeaderTitle>
        <HeaderSubtitle>{t('signIn.subtitle')}</HeaderSubtitle>
      </HeaderWrapper>

      <InputContainer>
        <Label>{t('signIn.email')}</Label>
        <Input
          placeholder={t('signIn.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#7C7C7C"
        />
      </InputContainer>

      <InputContainer>
        <Label>{t('signIn.password')}</Label>
        <Input
          placeholder={t('signIn.passwordPlaceholder')}
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
          {t('signIn.forgotPassword')}
        </ForgotPasswordLink>
      </ForgotPasswordContainer>

      <CustomButton onPress={handleSignIn}>
        <ButtonText>{t('signIn.login')}</ButtonText>
      </CustomButton>

      <SignUpLinkContainer>
        <SignUpText>
          {t('signIn.noAccount')} <SignUpLink onPress={() => navigation.navigate('SignUp')}>{t('signIn.register')}</SignUpLink>
        </SignUpText>
      </SignUpLinkContainer>

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
