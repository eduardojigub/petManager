import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CustomBackButton from '../components/CustomBackButton';
import TranslatedHeaderTitle from '../components/TranslatedHeaderTitle';
import { HomeStackParamList } from '../types/navigation';
import { headerStyle } from './styles';

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerStyle,
          headerTitle: () => <TranslatedHeaderTitle translationKey="nav.editProfile" />,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
    </Stack.Navigator>
  );
}
