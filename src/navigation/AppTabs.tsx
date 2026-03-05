import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileStack from './ProfileStack';
import HealthStack from './HealthStack';
import ScheduleStack from './ScheduleStack';
import SettingsStack from './SettingsStack';
import ExpenseScreen from '../screens/ExpenseScreen';
import { DogProfileContext } from '../context/DogProfileContext';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const { selectedDog } = useContext(DogProfileContext);

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
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: selectedDog
            ? `Expenses for ${selectedDog.name}`
            : 'Expenses',
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
