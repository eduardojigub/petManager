import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen'; // New Edit Profile Screen
import HealthScreen from './src/screens/HealthScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Profile and Edit Profile
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="ProfileTab" // Renamed from "Profile" to avoid conflict
        screenOptions={{
          tabBarActiveTintColor: '#4caf50', // Active tab color
          tabBarInactiveTintColor: '#888',  // Inactive tab color
          headerShown: false, // Remove header from the entire tab navigator
        }}
      >
        <Tab.Screen
          name="ProfileTab"  // Renamed to "ProfileTab"
          component={ProfileStack} // Use ProfileStack instead of just ProfileScreen
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: () => <Text>🐶</Text>, // Icon placeholder
            headerShown: false, // Remove header from the entire tab navigator
          }}
        />
        <Tab.Screen
          name="Health"
          component={HealthScreen}
          options={{
            tabBarLabel: 'Health',
            tabBarIcon: () => <Text>💉</Text>, // Icon placeholder
            headerShown: false, // Remove header from the entire tab navigator
          }}
        />
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            tabBarLabel: 'Schedule',
            tabBarIcon: () => <Text>📅</Text>, // Icon placeholder
            headerShown: false, // Remove header from the entire tab navigator
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: () => <Text>⚙️</Text>, // Icon placeholder
            headerShown: false, // Remove header from the entire tab navigator
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
