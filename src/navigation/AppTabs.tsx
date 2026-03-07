import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStack from './HomeStack';
import HealthStack from './HealthStack';
import SettingsStack from './SettingsStack';
import ExpenseStack from './ExpenseStack';
import { AppTabsParamList } from '../types/navigation';
import { LanguageContext } from '../context/LanguageContext';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabs() {
  const { t } = useContext(LanguageContext);

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: '#41245C',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: t('tab.home'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthStack}
        options={{
          tabBarLabel: t('tab.health'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseStack}
        options={{
          tabBarLabel: t('tab.expenses'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="currency-usd" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: t('tab.settings'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
