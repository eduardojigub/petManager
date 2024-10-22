import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, Alert, TouchableOpacity } from 'react-native';
import {
  Container,
  Title,
  ButtonText,
  ExpenseItem,
  ExpenseItemText,
  ExpenseIconContainer,
  ExpenseDateText,
  AddButton,
  TotalText,
  ListItemDetailHint,
  TrashIconContainer,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { useNavigation } from '@react-navigation/native';
import * as Icon from 'phosphor-react-native'; // Icons for expense types

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

  // Function to render the correct icon based on expense type
  const getExpenseIcon = (type) => {
    switch (type) {
      case 'Food':
        return <Icon.ForkKnife size={24} color="#7289DA" />;
      case 'Vet':
        return <Icon.Stethoscope size={24} color="#7289DA" />;
      case 'Toys':
        return <Icon.PuzzlePiece size={24} color="#7289DA" />;
      case 'Grooming':
        return <Icon.Scissors size={24} color="#7289DA" />;
      case 'Other':
      default:
        return <Icon.FileText size={24} color="#7289DA" />;
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await db.collection('expenses').doc(expenseId).delete();
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
      setTotal((prevTotal) => prevTotal - expenses.find((expense) => expense.id === expenseId).amount);
      Alert.alert('Success', 'Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      Alert.alert('Error', 'Unable to delete the expense.');
    }
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteExpense(expenseId) },
      ],
      { cancelable: true }
    );
  };

  const renderExpenseItem = ({ item }) => {
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <ExpenseItem onPress={() => navigation.navigate('ExpenseDetails', { expense: item })}>
        {/* Icon for each expense */}
        <ExpenseIconContainer>{getExpenseIcon(item.type)}</ExpenseIconContainer>
    
        {/* Title, date, and amount */}
        <View style={{ flex: 1 }}>
          <ExpenseItemText>{item.title}</ExpenseItemText>
          <ListItemDetailHint>
           <ExpenseDateText>{formattedDate}</ExpenseDateText>
          </ListItemDetailHint>
        </View>
    
        {/* Amount */}
        <ExpenseItemText style={{ fontWeight: 'bold' }}>
          ${item.amount.toFixed(2)}
        </ExpenseItemText>
    
        {/* Delete button */}
        <TrashIconContainer onPress={() => handleDeleteExpense(item.id)}>
          <Icon.TrashSimple size={20} color="#FF5C5C" />
        </TrashIconContainer>
      </ExpenseItem>
    );
  };

  return (
    <Container>
      <Title>Expenses for {selectedDog?.name}</Title>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<ExpenseItemText>No expenses found.</ExpenseItemText>}
        showsVerticalScrollIndicator={false}
      />

      <TotalText>Total: ${total.toFixed(2)}</TotalText>

      <AddButton onPress={() => navigation.navigate('AddExpense')}>
        <ButtonText>Add Expense</ButtonText>
      </AddButton>
    </Container>
  );
}
