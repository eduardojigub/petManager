import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { DogProfileProvider } from './src/context/DogProfileContext';
import { getAuth, onAuthStateChanged, FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import AppTabs from './src/navigation/AppTabs';
import AuthStack from './src/navigation/AuthStack';
import AddScheduleScreen from './src/screens/AddScheduleScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import CustomBackButton from './src/components/CustomBackButton';
import { SafeArea, LoadingContainer } from './src/navigation/styles';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const handleAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const askNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Atenção',
          'Você precisa habilitar as permissões de notificações para receber lembretes.'
        );
      }
    };
    askNotificationPermission();
  }, []);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  useEffect(() => {
    if (!initializing && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [initializing, fontsLoaded]);

  if (initializing || !fontsLoaded) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#7289DA" />
      </LoadingContainer>
    );
  }

  return (
    <DogProfileProvider>
      <NavigationContainer>
        <SafeArea>
          <Stack.Navigator>
            {user ? (
              <>
                <Stack.Screen
                  name="AppTabs"
                  component={AppTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddSchedule"
                  component={AddScheduleScreen}
                  options={({ route }) => ({
                    headerStyle,
                    headerTitle: route.params?.isEditMode
                      ? 'Edit Schedule'
                      : 'Add Schedule',
                    headerTitleStyle,
                    headerLeft: ({ onPress }) => (
                      <CustomBackButton onPress={onPress} />
                    ),
                  })}
                />
                <Stack.Screen
                  name="AddExpense"
                  component={AddExpenseScreen}
                  options={({ route }) => ({
                    headerStyle,
                    headerTitle: route.params?.expense
                      ? 'Edit Expense'
                      : 'Add Expense',
                    headerTitleStyle,
                    headerLeft: ({ onPress }) => (
                      <CustomBackButton onPress={onPress} />
                    ),
                  })}
                />
              </>
            ) : (
              <Stack.Screen
                name="AuthStack"
                component={AuthStack}
                options={{ headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </SafeArea>
      </NavigationContainer>
    </DogProfileProvider>
  );
}
