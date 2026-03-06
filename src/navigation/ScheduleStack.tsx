import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleScreen from '../screens/ScheduleScreen';
import AddScheduleScreen from '../screens/AddScheduleScreen';
import CustomBackButton from '../components/CustomBackButton';
import TranslatedHeaderTitle from '../components/TranslatedHeaderTitle';
import { ScheduleStackParamList } from '../types/navigation';
import { headerStyle } from './styles';

const Stack = createStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddSchedule"
        component={AddScheduleScreen}
        options={({ route, navigation }) => ({
          headerStyle,
          headerTitle: () => (
            <TranslatedHeaderTitle
              translationKey={route.params?.isEditMode ? 'nav.editSchedule' : 'nav.addSchedule'}
            />
          ),
          headerLeft: () => (
            <CustomBackButton
              onPress={() => {
                if (route.params?.fromProfile) {
                  navigation.navigate('ProfileTab');
                } else {
                  navigation.goBack();
                }
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
