
import React, { useState, useEffect } from 'react';
import { Switch, Alert } from 'react-native';
import { Container, OptionRow, OptionText } from './styles';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManageNotificationsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await AsyncStorage.getItem('notificationsEnabled');
      if (savedSettings !== null) {
        setNotificationsEnabled(JSON.parse(savedSettings));
      }
    };
    loadSettings();
  }, []);

  const toggleNotifications = async () => {
    setNotificationsEnabled((prev) => !prev);
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(!notificationsEnabled));

    if (!notificationsEnabled) {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Enable notifications in device settings.');
      }
    }
  };

  return (
    <Container>
      <OptionRow>
        <OptionText>Enable Notifications</OptionText>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </OptionRow>
      {/* Add more options for specific notification types if needed */}
    </Container>
  );
}
