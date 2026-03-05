import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HealthRecordsScreen from '../screens/HealthRecordsScreen';
import HealthRecordDetailsScreen from '../screens/HealthRecordsDetailScreen';
import AddHealthRecordScreen from '../screens/AddHealthRecord';
import CustomBackButton from '../components/CustomBackButton';
import { DogProfileContext } from '../context/DogProfileContext';
import { HealthStackParamList } from '../types/navigation';

const Stack = createStackNavigator<HealthStackParamList>();

const headerStyle = {
  backgroundColor: '#fff',
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
};

const headerTitleStyle = {
  fontFamily: 'Poppins_400Regular',
  fontWeight: 'normal' as const,
};

export default function HealthStack() {
  const { selectedDog } = useContext(DogProfileContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthRecords"
        component={HealthRecordsScreen}
        options={{
          headerStyle,
          headerTitle: selectedDog
            ? `Health Records for ${selectedDog.name}`
            : 'Health Records',
          headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="HealthRecordDetails"
        component={HealthRecordDetailsScreen}
        options={{
          headerStyle,
          headerTitle: 'Record Details',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={({ route }) => ({
          headerStyle,
          headerTitle: route.params?.isEditMode
            ? 'Edit Health Record'
            : 'Add Health Record',
          headerTitleStyle,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        })}
      />
    </Stack.Navigator>
  );
}
