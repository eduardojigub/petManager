import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
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
import { ensureUserIdBackfill } from './src/firebase/userIdBackfill';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function PreparingAccount() {
  return null;
}

const headerStyle = {
  backgroundColor: '#fff',
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
};

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const [readyUserId, setReadyUserId] = useState<string | null>(null);
  const [appReady, setAppReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const userId = user?.uid;
  const ownershipReady = !userId || readyUserId === userId;

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
    if (initializing) return undefined;
    let cancelled = false;

    if (!userId) {
      setReadyUserId(null);
      return undefined;
    }

    const timeout = setTimeout(() => {
      if (!cancelled) setReadyUserId(userId);
    }, 45000);

    ensureUserIdBackfill(userId)
      .catch((error: unknown) => {
        console.warn('userId backfill failed', error);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!cancelled) setReadyUserId(userId);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [initializing, userId]);

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    };
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setButtonStyleAsync('dark').catch(() => undefined);
  }, []);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  const waitingForBackfill = Boolean(userId) && !ownershipReady;
  const isReady = !initializing && fontsLoaded && (!waitingForBackfill || appReady);

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

  const splashOverlayVisible = !appReady || waitingForBackfill;

  return (
    <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    <KeyboardProvider statusBarTranslucent navigationBarTranslucent preserveEdgeToEdge>
    <StatusBar style={splashOverlayVisible ? 'light' : 'dark'} />
    <LanguageProvider>
    <DogProfileProvider>
      <NavigationContainer>
        <View style={styles.root}>
          <Stack.Navigator>
            {user && ownershipReady ? (
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
            ) : user ? (
              <Stack.Screen
                name="PreparingAccount"
                component={PreparingAccount}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="AuthStack"
                component={AuthStack}
                options={{ headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </View>
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
      {appReady && waitingForBackfill && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: '#59468E' }]}
        />
      )}
    </DogProfileProvider>
    </LanguageProvider>
    </KeyboardProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
