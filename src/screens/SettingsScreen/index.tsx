import React from 'react';
import { Container, Title, Button, ButtonText } from './styles'; 
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function SettingsScreen() {


  const handleLogout = () => {
    auth()
      .signOut()
      .catch((error) => {
        Alert.alert('Logout Error', error.message);
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
