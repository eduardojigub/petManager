import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
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
  TogglePasswordIcon,
  CheckboxContainer,
  SignInLinkContainer,
  SignInText,
  SignInLink,
  CheckboxLabel,
  TermsLink,
  TermsModalOverlay,
  TermsModalContent,
  TermsTitle,
  TermsScrollView,
  TermsBodyText,
  KeyboardAvoidingContainer,
} from './styles';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import CustomAlert from '../../../components/GlobalAlert/GlobalAlert';
import { LanguageContext } from '../../../context/LanguageContext';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password
  const [agree, setAgree] = useState(false);
  const { alertVisible, alertTitle, alertMessage, showAlert, hideAlert } = useAlert();
  const [termsVisible, setTermsVisible] = useState(false);
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlert(t('common.error'), t('signUp.allFieldsRequired'));
      return;
    }
    if (password.length < 6) {
      showAlert(t('common.error'), t('signUp.passwordMinLength'));
      return;
    }
    if (password !== confirmPassword) {
      showAlert(t('common.error'), t('signUp.passwordsMustMatch'));
      return;
    }
    if (!agree) {
      showAlert(t('common.error'), t('signUp.mustAgreeTerms'));
      return;
    }

    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigation.navigate('Initial'); // Redirect back to initial screen after signing up
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showAlert(t('common.error'), t('signUp.emailAlreadyRegistered'));
      } else {
        showAlert(t('common.error'), error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingContainer
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <HeaderWrapper>
            <HeaderTitle>{t('signUp.welcome')}</HeaderTitle>
            <HeaderSubtitle>{t('signUp.subtitle')}</HeaderSubtitle>
          </HeaderWrapper>

          <InputContainer>
            <Label>{t('signUp.email')}</Label>
            <Input
              placeholder={t('signUp.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#7C7C7C"
            />
          </InputContainer>

          <InputContainer>
            <Label>{t('signUp.password')}</Label>
            <Input
              placeholder={t('signUp.passwordPlaceholder')}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#7C7C7C"
            />
            <TogglePasswordIcon onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#7C7C7C"
              />
            </TogglePasswordIcon>
          </InputContainer>

          <InputContainer>
            <Label>{t('signUp.confirmPassword')}</Label>
            <Input
              placeholder={t('signUp.confirmPlaceholder')}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#7C7C7C"
            />
            <TogglePasswordIcon
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#7C7C7C"
              />
            </TogglePasswordIcon>
          </InputContainer>

          <CheckboxContainer>
            <CheckBox
              value={agree}
              onValueChange={setAgree}
              tintColors={{ true: '#41245C', false: '#7C7C7C' }}
            />
            <CheckboxLabel>
              {t('signUp.agreeWith')}{' '}
            </CheckboxLabel>
            <TouchableOpacity onPress={() => setTermsVisible(true)}>
              <TermsLink>{t('signUp.termsConditions')}</TermsLink>
            </TouchableOpacity>
          </CheckboxContainer>

          <CustomButton onPress={handleSignUp}>
            <ButtonText>{t('signUp.register')}</ButtonText>
          </CustomButton>

          <SignInLinkContainer>
            <SignInText>
              {t('signUp.hasAccount')}{' '}
              <SignInLink onPress={() => navigation.navigate('SignIn')}>
                {t('signUp.login')}
              </SignInLink>
            </SignInText>
          </SignInLinkContainer>

          {/* Terms & Conditions Modal */}
          <Modal
            visible={termsVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setTermsVisible(false)}
          >
            <TermsModalOverlay>
              <TermsModalContent>
                <TermsTitle>{t('signUp.termsTitle')}</TermsTitle>
                <TermsScrollView>
                  <TermsBodyText>
                    {t('terms.signUpIntro')}
                    {'\n\n'}{t('terms.signUp1')}
                    {'\n\n'}{t('terms.signUp2')}
                    {'\n\n'}{t('terms.signUp3')}
                    {'\n\n'}{t('terms.signUp4')}
                    {'\n\n'}{t('terms.signUp5')}
                  </TermsBodyText>
                </TermsScrollView>
                <CustomButton onPress={() => setTermsVisible(false)}>
                  <ButtonText>{t('common.close')}</ButtonText>
                </CustomButton>
              </TermsModalContent>
            </TermsModalOverlay>
          </Modal>

          {/* Custom Alert */}
          <CustomAlert
            visible={alertVisible}
            onClose={hideAlert}
            title={alertTitle}
            message={alertMessage}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}
