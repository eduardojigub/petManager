import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
  Container,
  Title,
  ButtonText,
  ExpenseItem,
  ExpenseItemText,
  AddButton,
  TotalText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { useNavigation } from '@react-navigation/native';

export default function ExpenseScreen() {
  const { selectedDog } = useContext(DogProfileContext);
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (!selectedDog) {
      Alert.alert('No Dog Selected', 'Please select a dog to view expenses.');
      return;
    }

    // Fetch expenses for the selected dog
    const fetchExpenses = async () => {
      try {
        const snapshot = await db.collection('expenses').where('dogId', '==', selectedDog.id).get();
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExpenses(expensesData);

        // Calculate total expenses
        const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
        setTotal(totalExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [selectedDog]);

  const renderExpenseItem = ({ item }) => (
    <ExpenseItem>
      <ExpenseItemText>{item.title}</ExpenseItemText>
      <ExpenseItemText>${item.amount.toFixed(2)}</ExpenseItemText>
    </ExpenseItem>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title>Expenses for {selectedDog?.name}</Title>

          <FlatList
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<ExpenseItemText>No expenses found.</ExpenseItemText>}
          />

          <TotalText>Total: ${total.toFixed(2)}</TotalText>

          <AddButton onPress={() => navigation.navigate('AddExpense')}>
            <ButtonText>Add Expense</ButtonText>
          </AddButton>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
