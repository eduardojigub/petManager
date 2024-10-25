import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
  TouchableOpacity,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import HealthRecordsScreen from './src/screens/HealthRecordsScreen';
import HealthRecordDetailsScreen from './src/screens/HealthRecordsDetailScreen';
import AddHealthRecordScreen from './src/screens/AddHealthRecord';
import ScheduleScreen from './src/screens/ScheduleScreen';
import AddScheduleScreen from './src/screens/AddScheduleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Notifications from 'expo-notifications';
import { DogProfileContext, DogProfileProvider } from './src/context/DogProfileContext';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as SplashScreen from 'expo-splash-screen';
import InitialScreen from './src/screens/LoginScreen/InitialScreen';
import SignInScreen from './src/screens/LoginScreen/SignIn';
import SignUpScreen from './src/screens/LoginScreen/SignUp';
import ForgotPasswordScreen from './src/screens/LoginScreen/ForgotPassword';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import ManageNotificationsScreen from './src/screens/ManageNotificationScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomBackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#D1D1D1',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    }}
  >
    <Icon name="chevron-left" size={20} color="#000" />
  </TouchableOpacity>
);

// Stack Navigator for Profile and Edit Profile
function ProfileStack() {
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

// Stack Navigator for Health Records and Details
function HealthStack() {
  const { selectedDog } = useContext(DogProfileContext); // Access selectedDog from context
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthRecords"
        component={HealthRecordsScreen}
        options={{
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: selectedDog
          ? `Health Records for ${selectedDog.name}` // Show "for {selectedDog.name}" if selectedDog exists
          : 'Health Records', // Just "Health Records" if no selectedDog
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
        }}
      />
      <Stack.Screen
        name="HealthRecordDetails"
        component={HealthRecordDetailsScreen}
        options={{
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: 'Record Details',
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={{
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: 'Add Health Record',
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

// Stack Navigator for Schedule and Add Schedule
function ScheduleStack() {

  const { selectedDog } = useContext(DogProfileContext); // Access selectedDog from context
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: selectedDog
          ? `Schedule for ${selectedDog.name}` // Show "for {selectedDog.name}" if selectedDog exists
          : 'Schedule',  // Just "Schedule" if no selectedDog
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
        }}
      />
      <Stack.Screen
        name="AddSchedule"
        component={AddScheduleScreen}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: route.params?.isEditMode
            ? 'Edit Schedule'
            : 'Add Schedule',
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        })}
      />
    </Stack.Navigator>
  );
}

// Stack for Authentication
function AuthStack() {
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
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: 'Sign In',
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: 'Sign Up',
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: 'Forgot Password',
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

function SettingsStack() {
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
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: 'Manage notifications',
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      {/* Add more settings-related screens as needed */}
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator for the main application
function AppTabs() {
  const { selectedDog } = useContext(DogProfileContext); // Access selectedDog from context
  return (
    <Tab.Navigator
      initialRouteName="ProfileTab"
      screenOptions={{
        tabBarActiveTintColor: '#41245C',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="dog" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthStack}
        options={{
          tabBarLabel: 'Health',
          tabBarIcon: ({ color, size }) => (
            <Icon name="medical-bag" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleStack}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseScreen}
        options={{
          tabBarLabel: 'Expenses',
          tabBarIcon: ({ color, size }) => (
            <Icon name="currency-usd" color={color} size={size} />
          ),
          headerShown: true, // Make sure the header is shown
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: selectedDog
          ? `Expenses for ${selectedDog.name}` // Show "for {selectedDog.name}" if selectedDog exists
          : 'Expenses',  // Just "Expenses" if no selectedDog
          headerTitleStyle: {
            fontFamily: 'Poppins_400Regular',
            fontWeight: 'normal',
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  // Solicita permissão para notificações ao iniciar o app
  useEffect(() => {
    const askNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Atenção',
          'Você precisa habilitar as permissões de notificações para receber lembretes.'
        );
        return;
      }
    };

    askNotificationPermission();
  }, []);

  useEffect(() => {
    // This handler will allow notifications to be shown in the foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  // Hide splash screen once initializing is false
  useEffect(() => {
    if (!initializing && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [initializing, fontsLoaded]);

  // Exibe uma tela de carregamento enquanto verifica o status de login
  if (initializing || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7289DA" />
      </View>
    );
  }

  return (
    <DogProfileProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.safeArea}>
          <Stack.Navigator>
            {user ? (
              <>
                <Stack.Screen
                  name="AppTabs"
                  component={AppTabs}
                  options={{ headerShown: false }}
                />

                {/* Add AddSchedule here as a separate screen */}
                <Stack.Screen
                  name="AddSchedule"
                  component={AddScheduleScreen}
                  options={({ route }) => ({
                    headerStyle: {
                      backgroundColor: '#fff',
                      elevation: 0,
                      shadowOpacity: 0,
                      borderBottomWidth: 0,
                    },
                    headerTitle: route.params?.isEditMode
                      ? 'Edit Schedule'
                      : 'Add Schedule',
                    headerTitleStyle: {
                      fontFamily: 'Poppins_400Regular',
                      fontWeight: 'normal',
                    },
                    headerLeft: ({ onPress }) => (
                      <CustomBackButton onPress={onPress} />
                    ),
                  })}
                />
                <Stack.Screen
                  name="AddExpense"
                  component={AddExpenseScreen}
                  options={{
                    headerStyle: {
                      backgroundColor: '#fff',
                      elevation: 0,
                      shadowOpacity: 0,
                      borderBottomWidth: 0,
                    },
                    headerTitle: 'Add Expense',
                    headerTitleStyle: {
                      fontFamily: 'Poppins_400Regular',
                      fontWeight: 'normal',
                    },
                    headerLeft: ({ onPress }) => (
                      <CustomBackButton onPress={onPress} />
                    ),
                  }}
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
        </SafeAreaView>
      </NavigationContainer>
    </DogProfileProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
