import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleScreen from '../screens/ScheduleScreen';
import AddScheduleScreen from '../screens/AddScheduleScreen';
import CustomBackButton from '../components/CustomBackButton';
import { DogProfileContext } from '../context/DogProfileContext';
import { ScheduleStackParamList } from '../types/navigation';
import { headerStyle, headerTitleStyle } from './styles';

const Stack = createStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  const { selectedDog } = useContext(DogProfileContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{
          headerStyle,
          headerTitle: selectedDog
            ? `Schedule for ${selectedDog.name}`
            : 'Schedule',
          headerTitleStyle,
        }}
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
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        })}
      />
    </Stack.Navigator>
  );
}
