import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
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
import { Text } from 'react-native';
import * as Notifications from 'expo-notifications'; // Importar expo-notifications

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Profile and Edit Profile
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Health Records and Details
function HealthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthRecords"
        component={HealthRecordsScreen}
        options={{ title: 'Health Records' }}
      />
      <Stack.Screen
        name="HealthRecordDetails"
        component={HealthRecordDetailsScreen}
        options={{ title: 'Record Details' }}
      />
      <Stack.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={{ title: 'Add Health Record' }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Schedule and Add Schedule
function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{ title: 'Schedule' }}
      />
      <Stack.Screen
        name="AddSchedule"
        component={AddScheduleScreen}
        options={{ title: 'Add Schedule' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  // Solicita permissão para notificações ao iniciar o app
  useEffect(() => {
    const askNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Atenção', 'Você precisa habilitar as permissões de notificações para receber lembretes.');
        return;
      }
    };

    askNotificationPermission();
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <Tab.Navigator
          initialRouteName="ProfileTab"
          screenOptions={{
            tabBarActiveTintColor: '#4caf50',
            tabBarInactiveTintColor: '#888',
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="ProfileTab"
            component={ProfileStack}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: () => <Text>🐶</Text>,
            }}
          />
          <Tab.Screen
            name="Health"
            component={HealthStack}
            options={{
              tabBarLabel: 'Health',
              tabBarIcon: () => <Text>💉</Text>,
            }}
          />
          <Tab.Screen
            name="Schedule"
            component={ScheduleStack}
            options={{
              tabBarLabel: 'Schedule',
              tabBarIcon: () => <Text>📅</Text>,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: () => <Text>⚙️</Text>,
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
