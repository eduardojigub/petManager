import React from 'react';
import { Container, Title, Button, ButtonText } from './styles';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {

  const handleLogout = () => {
    auth()
      .signOut()
      .catch((error) => {
        Alert.alert('Logout Error', error.message);
      });
  };
  const navigation = useNavigation();
  return (
    <Container>
      <Title>Settings</Title>

      {/* <Button onPress={() => alert('Navigate to edit profile')}>
        <ButtonText>Edit Profile</ButtonText>
      </Button> */}

        <Button onPress={() => navigation.navigate('ManageNotifications')}>
          <ButtonText>Manage Notifications</ButtonText>
        </Button>
{/* 
      <Button onPress={() => alert('Choose language')}>
        <ButtonText>Choose Language</ButtonText>
      </Button> */}

      <Button onPress={() => alert('Show terms of use')}>
        <ButtonText>Terms of Use and Privacy</ButtonText>
      </Button>

      <Button onPress={() => alert('Show app information')}>
        <ButtonText>About the App</ButtonText>
      </Button>

      <Button onPress={handleLogout}>
        <ButtonText>Log Out</ButtonText>
      </Button>
    </Container>
  );
}
