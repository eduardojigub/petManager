
import React, { useState, useEffect, useContext } from 'react';
import { Switch, Alert } from 'react-native';
import { Container, OptionRow, OptionText } from './styles';
import { LanguageContext } from '../../context/LanguageContext';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManageNotificationsScreen() {
  const { t } = useContext(LanguageContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('notificationsEnabled');
        if (savedSettings !== null) {
          setNotificationsEnabled(JSON.parse(savedSettings));
        }
      } catch {
        setNotificationsEnabled(true);
      }
    };
    loadSettings();
  }, []);

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newValue));

    if (newValue) {
      // Request notification permissions when enabling
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('notifications.permissionRequired'), t('notifications.enableInSettings'));
      }
    } else {
      // Cancel all pending notifications when disabling
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert(t('notifications.disabledTitle'), t('notifications.disabledMsg'));
    }
  };

  return (
    <Container>
      <OptionRow>
        <OptionText>{t('notifications.enable')}</OptionText>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </OptionRow>
      {/* Add more options for specific notification types if needed */}
    </Container>
  );
}
