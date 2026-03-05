import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import ManageNotificationsScreen from '../screens/ManageNotificationScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import CustomBackButton from '../components/CustomBackButton';

const Stack = createStackNavigator();

const headerStyle = {
  backgroundColor: '#fff',
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
};

const headerTitleStyle = {
  fontFamily: 'Poppins_400Regular',
  fontWeight: 'normal' as const,
};

export default function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="SettingsMain">
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerTitle: 'Settings', headerShown: false }}
      />
      <Stack.Screen
        name="ManageNotifications"
        component={ManageNotificationsScreen}
        options={{
          headerStyle,
          headerTitle: 'Manage notifications',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={ManageAccountScreen}
        options={{
          headerStyle,
          headerTitle: 'Update Password',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
    </Stack.Navigator>
  );
}
