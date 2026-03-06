import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  Alert,
  Animated,
  StyleSheet,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { DogProfileProvider } from './src/context/DogProfileContext';
import { LanguageProvider } from './src/context/LanguageContext';
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
import TranslatedHeaderTitle from './src/components/TranslatedHeaderTitle';
import { SafeArea } from './src/navigation/styles';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const headerStyle = {
  backgroundColor: '#fff',
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
};

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const [appReady, setAppReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
    Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  const isReady = !initializing && fontsLoaded;

  const onOverlayLayout = useCallback(() => {
    if (isReady) {
      SplashScreen.hideAsync().then(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => setAppReady(true));
      });
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <LanguageProvider>
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
                    headerTitle: () => (
                      <TranslatedHeaderTitle
                        translationKey={route.params?.isEditMode ? 'nav.editSchedule' : 'nav.addSchedule'}
                      />
                    ),
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
                    headerTitle: () => (
                      <TranslatedHeaderTitle
                        translationKey={route.params?.expense ? 'nav.editExpense' : 'nav.addExpense'}
                      />
                    ),
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
      {!appReady && (
        <Animated.View
          onLayout={onOverlayLayout}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: '#59468E', opacity: fadeAnim },
          ]}
        />
      )}
    </DogProfileProvider>
    </LanguageProvider>
  );
}
