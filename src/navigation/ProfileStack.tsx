import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CustomBackButton from '../components/CustomBackButton';
import { ProfileStackParamList } from '../types/navigation';

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
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: 'Edit Profile',
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
    </Stack.Navigator>
  );
}
