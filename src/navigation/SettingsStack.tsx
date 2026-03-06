import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import ManageNotificationsScreen from '../screens/ManageNotificationScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import AccountScreen from '../screens/AccountScreen';
import HelpScreen from '../screens/HelpScreen';
import EditUserProfileScreen from '../screens/EditUserProfileScreen';
import CustomBackButton from '../components/CustomBackButton';
import { SettingsStackParamList } from '../types/navigation';
import { headerStyle, headerTitleStyle } from './styles';

const Stack = createStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="SettingsMain">
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerTitle: 'Settings', headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerStyle,
          headerTitle: 'Account',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="EditUserProfile"
        component={EditUserProfileScreen}
        options={{
          headerStyle,
          headerTitle: 'Edit Profile',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
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
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{
          headerStyle,
          headerTitle: 'Help & FAQ',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
    </Stack.Navigator>
  );
}
