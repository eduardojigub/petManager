import React from 'react';
import ClearCacheButton from '../../components/ClearCacheButton/ClearCacheButton';
import { Container, Title, Button, ButtonText } from './styles'; // Importing the styled components
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {

  const navigation = useNavigation();

  const handleLogout = () => {
    // Here you can add any additional logout logic (e.g. removing session data)
    
    // Reset navigation flow and return to the login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }], // Navigate to the authentication stack
    });
  };

  return (
    <Container>
      <Title>Settings</Title>

      {/* Button to edit the profile */}
      <Button onPress={() => alert('Navigate to edit profile')}>
        <ButtonText>Edit Profile</ButtonText>
      </Button>

      {/* Manage notifications */}
      <Button onPress={() => alert('Navigate to notification settings')}>
        <ButtonText>Manage Notifications</ButtonText>
      </Button>

      {/* Button to choose language */}
      <Button onPress={() => alert('Choose language')}>
        <ButtonText>Choose Language</ButtonText>
      </Button>

      {/* Clear cache button */}
      <ClearCacheButton />

      {/* Terms of use and privacy policy */}
      <Button onPress={() => alert('Show terms of use')}>
        <ButtonText>Terms of Use and Privacy</ButtonText>
      </Button>

      {/* About the app */}
      <Button onPress={() => alert('Show app information')}>
        <ButtonText>About the App</ButtonText>
      </Button>

      {/* Logout (if applicable) */}
      <Button onPress={handleLogout}>
        <ButtonText>Log Out</ButtonText>
      </Button>
    </Container>
  );
}
