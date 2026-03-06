import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import ManageNotificationsScreen from '../screens/ManageNotificationScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import AccountScreen from '../screens/AccountScreen';
import HelpScreen from '../screens/HelpScreen';
import EditUserProfileScreen from '../screens/EditUserProfileScreen';
import CustomBackButton from '../components/CustomBackButton';
import TranslatedHeaderTitle from '../components/TranslatedHeaderTitle';
import { SettingsStackParamList } from '../types/navigation';
import { headerStyle } from './styles';

const Stack = createStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="SettingsMain">
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerStyle,
          headerTitle: () => <TranslatedHeaderTitle translationKey="nav.account" />,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="EditUserProfile"
        component={EditUserProfileScreen}
        options={{
          headerStyle,
          headerTitle: () => <TranslatedHeaderTitle translationKey="nav.editProfile" />,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="ManageNotifications"
        component={ManageNotificationsScreen}
        options={{
          headerStyle,
          headerTitle: () => <TranslatedHeaderTitle translationKey="nav.manageNotifications" />,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={ManageAccountScreen}
        options={{
          headerStyle,
          headerTitle: () => <TranslatedHeaderTitle translationKey="nav.updatePassword" />,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{
          headerStyle,
          headerTitle: () => <TranslatedHeaderTitle translationKey="nav.helpFaq" />,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
    </Stack.Navigator>
  );
}
