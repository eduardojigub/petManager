import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExpenseScreen from '../screens/ExpenseScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import CustomBackButton from '../components/CustomBackButton';
import TranslatedHeaderTitle from '../components/TranslatedHeaderTitle';
import { headerStyle } from './styles';

type ExpenseStackParamList = {
  ExpenseScreen: undefined;
  AddExpense: { expense?: any; addExpense?: (expense: any) => void };
};

const Stack = createStackNavigator<ExpenseStackParamList>();

export default function ExpenseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpenseScreen"
        component={ExpenseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={({ route, navigation }) => ({
          headerStyle,
          headerTitle: () => (
            <TranslatedHeaderTitle
              translationKey={route.params?.expense ? 'nav.editExpense' : 'nav.addExpense'}
            />
          ),
          headerLeft: () => (
            <CustomBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
