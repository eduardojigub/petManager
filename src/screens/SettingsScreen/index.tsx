import React, { useState } from 'react';
import {
  Container,
  Title,
  Button,
  ButtonText,
  ModalOverlay,
  ModalContainer,
  ModalText,
  CloseButton,
  CloseButtonText,
  ScrollContainer,
} from './styles';
import { Alert, Modal, Linking } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const appVersion = Constants.manifest?.version || 'Version not available';

export default function SettingsScreen() {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigation = useNavigation();

  const handleLogout = () => {
    auth()
      .signOut()
      .catch((error) => {
        Alert.alert('Logout Error', error.message);
      });
  };

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  const toggleTermsModal = () => {
    setShowTermsModal(!showTermsModal);
  };

  // Function to handle the account deletion link
  const handleDeleteAccount = () => {
    const url = 'https://jp7dc7wdnld.typeform.com/to/UukaGjeR';
    Linking.openURL(url).catch((err) =>
      Alert.alert('Error', 'Failed to open the link')
    );
  };

  return (
    <Container>
      <Title>Settings</Title>

      <Button onPress={() => navigation.navigate('ManageNotifications')}>
        <ButtonText>Manage Notifications</ButtonText>
      </Button>

      {/* New Button for Deleting Account */}
      <Button onPress={handleDeleteAccount}>
        <ButtonText>Delete my account</ButtonText>
      </Button>
      <Button onPress={() => navigation.navigate('AccountSettings')}>
        <ButtonText>Update Password</ButtonText>
      </Button>

      <Button onPress={toggleTermsModal}>
        <ButtonText>Terms of Use and Privacy</ButtonText>
      </Button> 

      <Button onPress={toggleAboutModal}>
        <ButtonText>About the App</ButtonText>
      </Button>

      <Button onPress={handleLogout}>
        <ButtonText>Log Out</ButtonText>
      </Button>



      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        transparent
        animationType="slide"
        onRequestClose={toggleAboutModal}
      >
        <ModalOverlay>
          <ModalContainer>
            <Title>About the App</Title>
            <ModalText>Version: {appVersion}</ModalText>
            <ModalText>Developed by C.A.T</ModalText>
            <CloseButton onPress={toggleAboutModal}>
              <CloseButtonText>Close</CloseButtonText>
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      {/* Terms and Privacy Modal */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType="slide"
        onRequestClose={toggleTermsModal}
      >
        <ModalOverlay>
          <ModalContainer>
            <Title>Terms of Use & Privacy Policy</Title>
            <ScrollContainer>
              <ModalText>
                Welcome to our application. By using this app, you agree to the
                following terms and conditions. We reserve the right to update
                these terms at any time.
              </ModalText>
              <ModalText>
                1. **Data Collection**: We collect data to improve user
                experience. We respect your privacy and ensure your data is
                secure.
              </ModalText>
              <ModalText>
                2. **Usage**: You agree not to misuse our services, including
                unlawful or unauthorized activities.
              </ModalText>
              <ModalText>
                3. **Disclaimer**: We are not liable for any losses or damages
                arising from your use of this app.
              </ModalText>
              <ModalText>
                For more details, please contact support@catapp.com. Thank you
                for choosing us.
              </ModalText>
            </ScrollContainer>
            <CloseButton onPress={toggleTermsModal}>
              <CloseButtonText>Close</CloseButtonText>
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}
