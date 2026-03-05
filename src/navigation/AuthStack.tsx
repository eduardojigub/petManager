import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InitialScreen from '../screens/LoginScreen/InitialScreen';
import SignInScreen from '../screens/LoginScreen/SignIn';
import SignUpScreen from '../screens/LoginScreen/SignUp';
import ForgotPasswordScreen from '../screens/LoginScreen/ForgotPassword';
import CustomBackButton from '../components/CustomBackButton';
import { AuthStackParamList } from '../types/navigation';

const Stack = createStackNavigator<AuthStackParamList>();

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

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Initial">
      <Stack.Screen
        name="Initial"
        component={InitialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerStyle,
          headerTitle: 'Sign In',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerStyle,
          headerTitle: 'Sign Up',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerStyle,
          headerTitle: 'Forgot Password',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
    </Stack.Navigator>
  );
}
