import React, { useContext } from 'react';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../../../hooks/useAlert';
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
import CustomAlert from '../../../components/GlobalAlert/GlobalAlert';
import { LanguageContext } from '../../../context/LanguageContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = React.useState('');
  const { alertVisible, alertTitle, alertMessage, showAlert, hideAlert } = useAlert();
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  const handlePasswordReset = async () => {
    if (!email) {
      showAlert(t('common.error'), t('forgot.enterEmail'));
      return;
    }

    try {
      await sendPasswordResetEmail(getAuth(), email);
      showAlert(t('common.success'), t('forgot.emailSent'));
    } catch (error) {
      showAlert(t('common.error'), error.message);
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <HeaderTitle>{t('forgot.title')}</HeaderTitle>
        <HeaderSubtitle>{t('forgot.subtitle')}</HeaderSubtitle>
      </HeaderWrapper>

      <InputContainer>
        <Input
          placeholder={t('forgot.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#7C7C7C"
        />
      </InputContainer>

      <CustomButton onPress={handlePasswordReset}>
        <ButtonText>{t('forgot.resetButton')}</ButtonText>
      </CustomButton>

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
