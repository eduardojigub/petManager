import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Icon from 'phosphor-react-native'; // Icons for expense types
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native'; // For responsive chart sizing
import { LinearGradient } from 'expo-linear-gradient';
import {
  EmptyListContainer,
  EmptyListImage,
  EmptyListText,
} from '../HealthRecordsScreen/styles';
import expensesRecordsImage from '../../assets/expenseScreen.png';

export default function ExpenseScreen() {
  const { selectedDog } = useContext(DogProfileContext);
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [expenseDistribution, setExpenseDistribution] = useState({});
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  // Fetch expenses function
  // Fetch expenses function
  const fetchExpenses = async () => {
    if (!selectedDog) {
      return;
    }

    try {
      const snapshot = await db
        .collection('expenses')
        .where('dogId', '==', selectedDog.id)
        .get();

      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort the expenses by date, newest to oldest
      const sortedExpenses = expensesData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Newest date first
      });

      setExpenses(sortedExpenses);

      // Calculate total expenses
      const totalExpenses = sortedExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      setTotal(totalExpenses);

      // Calculate expense distribution by type
      const distribution = sortedExpenses.reduce((acc, expense) => {
        acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
        return acc;
      }, {});

      setExpenseDistribution(distribution);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!selectedDog) {
        setExpenses([]); // Clear schedules if no dog is selecte
      } else {
        fetchExpenses(); // Load schedules if a dog is selected
      }
    }, [selectedDog, navigation])
  );

  // Prepare data for PieChart

  const chartData = Object.keys(expenseDistribution).map((type, index) => {
    return {
      name: `${type}`,
      amount: expenseDistribution[type],
      color: ['#7289DA', '#FFA726', '#66BB6A', '#EF5350', '#AB47BC'][index % 5], // cycle through colors
      legendFontColor: '#333',
      legendFontSize: 15,
    };
  });
  // Function to render the correct icon based on expense type
  const getExpenseIcon = (type) => {
    switch (type) {
      case 'Food':
        return <Icon.ForkKnife size={24} color="#7289DA" />;
      case 'Medical':
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
      // Find the expense amount before deletion to update the total and distribution
      const expenseToDelete = expenses.find(
        (expense) => expense.id === expenseId
      );

      // Delete the expense from Firestore
      await db.collection('expenses').doc(expenseId).delete();

      // Filter out the deleted expense from the state
      const updatedExpenses = expenses.filter(
        (expense) => expense.id !== expenseId
      );
      setExpenses(updatedExpenses);

      // Update total by subtracting the deleted expense amount
      setTotal((prevTotal) => prevTotal - expenseToDelete.amount);

      // Recalculate the expense distribution
      const updatedDistribution = updatedExpenses.reduce((acc, expense) => {
        acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
        return acc;
      }, {});

      setExpenseDistribution(updatedDistribution);

      // Display success alert
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
      <ExpenseItem
        onPress={() => navigation.navigate('ExpenseDetails', { expense: item })}
      >
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

  const renderEmptyList = () => (
    <EmptyListContainer>
      <EmptyListImage source={expensesRecordsImage} />
      <EmptyListText>
        No expenses yet. Add your first pet and start adding records to keep
        track of your expenses.
      </EmptyListText>
    </EmptyListContainer>
  );

  return (
    <Container>

      {/* PieChart for Expense Distribution */}
      {expenses && expenses.length > 0 && (
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      )}
      {/* Divider above the FlatList */}
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
      {expenses && expenses.length > 0 && (
        <View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.1)']} // Start with transparent, fade to a slight dark color
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 10, // Adjust height of the gradient
            }}
          />
        </View>
      )}
      
        <>
          {selectedDog && expenses.length > 0 && (
            <TotalText>Total: ${total.toFixed(2)}</TotalText>
          )}

          {selectedDog && (
            <AddButton onPress={() => navigation.navigate('AddExpense')}>
              <ButtonText>Add Expense</ButtonText>
            </AddButton>
          )}
        </>
    </Container>
  );
}
