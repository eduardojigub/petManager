import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HealthRecordsScreen from '../screens/HealthRecordsScreen';
import HealthRecordDetailsScreen from '../screens/HealthRecordsDetailScreen';
import AddHealthRecordScreen from '../screens/AddHealthRecord';
import CustomBackButton from '../components/CustomBackButton';
import TranslatedHeaderTitle from '../components/TranslatedHeaderTitle';
import { HealthStackParamList } from '../types/navigation';
import { headerStyle } from './styles';

const Stack = createStackNavigator<HealthStackParamList>();

export default function HealthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthRecords"
        component={HealthRecordsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HealthRecordDetails"
        component={HealthRecordDetailsScreen}
        options={{
          headerStyle,
          headerTitle: () => <TranslatedHeaderTitle translationKey="nav.recordDetails" />,
          headerLeft: ({ onPress }) => <CustomBackButton onPress={onPress} />,
        }}
      />
      <Stack.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={({ route, navigation }) => ({
          headerStyle,
          headerTitle: () => (
            <TranslatedHeaderTitle
              translationKey={route.params?.isEditMode ? 'nav.editRecord' : 'nav.addRecord'}
            />
          ),
          headerLeft: () => (
            <CustomBackButton
              onPress={() => {
                if (route.params?.fromProfile) {
                  navigation.navigate('HomeTab');
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
