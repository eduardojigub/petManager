import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebase/auth';
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
} from './styles';
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import CustomAlert from '../../../components/GlobalAlert/GlobalAlert';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password
  const [agree, setAgree] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [termsVisible, setTermsVisible] = useState(false); // State for terms modal
  const navigation = useNavigation();

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlert('Error', 'All fields are required.');
      return;
    }
    if (password.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Error', 'Passwords must match.');
      return;
    }
    if (!agree) {
      showAlert('Error', 'You must agree to the terms & conditions.');
      return;
    }

    try {
      await auth.createUserWithEmailAndPassword(email, password);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#7C7C7C"
              />
            </TogglePasswordIcon>
          </InputContainer>

          <InputContainer>
            <Label>Confirm Password</Label>
            <Input
              placeholder="Confirm your password"
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
            <CheckboxLabel style={{ fontSize: 14 }}>
              I agree with{' '}
            </CheckboxLabel>
            <TouchableOpacity onPress={() => setTermsVisible(true)}>
              <TermsLink>terms & conditions</TermsLink>
            </TouchableOpacity>
          </CheckboxContainer>

          <CustomButton onPress={handleSignUp}>
            <ButtonText>Register</ButtonText>
          </CustomButton>

          <SignInLinkContainer>
            <SignInText>
              Already have an account?{' '}
              <SignInLink onPress={() => navigation.navigate('SignIn')}>
                Login
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
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <View
                style={{
                  width: '90%',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
                >
                  Terms and Conditions
                </Text>
                <ScrollView style={{ maxHeight: 400 }}>
                  <Text style={{ fontSize: 14 }}>
                    Welcome to our application. Please read the following terms
                    and conditions carefully.
                    {'\n\n'}1. **Acceptance of Terms** By accessing and using
                    this application, you accept and agree to be bound by these
                    terms and conditions. If you do not agree, you may not use
                    the application. The company reserves the right to modify
                    these terms at any time, and continued use of the app
                    implies acceptance of the new terms.
                    {'\n\n'}2. **User Responsibilities** Users agree to use the
                    application in compliance with all applicable laws and not
                    to engage in any activity that disrupts or harms the
                    functionality of the app, other users, or third parties.
                    Misuse of the application, including unauthorized access,
                    data tampering, or sharing of false information, may result
                    in suspension or termination of your account.
                    {'\n\n'}3. **Account Security** You are responsible for
                    maintaining the confidentiality of your account information,
                    including your password. Any activity conducted under your
                    account is your responsibility. Notify us immediately of any
                    unauthorized access to your account or breach of security.
                    {'\n\n'}4. **Intellectual Property** All content, features,
                    and functionality (including text, graphics, logos, and
                    images) are the exclusive property of the company and are
                    protected by copyright, trademark, and other laws.
                    Unauthorized use, reproduction, or distribution of any part
                    of this application is prohibited.
                    {'\n\n'}5. **Limitation of Liability** The company is not
                    liable for any damages resulting from the use or inability
                    to use the application, including, but not limited to,
                    indirect or consequential damages. The app is provided "as
                    is" and "as available" without any warranties, either
                    express or implied.
                  </Text>
                </ScrollView>
                <CustomButton onPress={() => setTermsVisible(false)}>
                  <ButtonText>Close</ButtonText>
                </CustomButton>
              </View>
            </View>
          </Modal>

          {/* Custom Alert */}
          <CustomAlert
            visible={alertVisible}
            onClose={() => setAlertVisible(false)}
            title={alertTitle}
            message={alertMessage}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
