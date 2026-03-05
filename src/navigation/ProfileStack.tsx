import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CustomBackButton from '../components/CustomBackButton';
import { ProfileStackParamList } from '../types/navigation';
import { headerStyle, headerTitleStyle } from './styles';

const Stack = createStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerStyle,
          headerTitle: 'Edit Profile',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
    </Stack.Navigator>
  );
}
