import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileStack from './ProfileStack';
import HealthStack from './HealthStack';
import ScheduleStack from './ScheduleStack';
import SettingsStack from './SettingsStack';
import ExpenseStack from './ExpenseStack';
import { AppTabsParamList } from '../types/navigation';
import { LanguageContext } from '../context/LanguageContext';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabs() {
  const { t } = useContext(LanguageContext);

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
          tabBarLabel: t('tab.profile'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="dog" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthStack}
        options={{
          tabBarLabel: t('tab.records'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard-text-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleStack}
        options={{
          tabBarLabel: t('tab.schedule'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
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
