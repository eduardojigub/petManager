import React, { useContext, useEffect, useState } from 'react';
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
  const [expenses, setExpenses] = useState([]); // For the filtered expenses
  const [allExpenses, setAllExpenses] = useState([]); // For the full list of expenses
  const [total, setTotal] = useState(0);
  const [expenseDistribution, setExpenseDistribution] = useState({});
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth()
  );
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Fetch expenses function
 
// Update fetchExpenses to filter after fetching
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

    setAllExpenses(sortedExpenses); // Store the full list of expenses

    // Filter by the currently selected month after fetching the expenses
    const currentMonth = new Date().getMonth();
    setSelectedMonthIndex(currentMonth);  // Ensure the correct month is selected
    updateFilteredExpenses(sortedExpenses, currentMonth); // Filter for the current month

  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
};

  useFocusEffect(
    React.useCallback(() => {
      // Fetch expenses and filter after fetching
      if (!selectedDog) {
        setExpenses([]); // Clear expenses if no dog is selected
      } else {
        fetchExpenses(); // Load expenses if a dog is selected
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

  // Filter expenses by the selected month
 // Filter expenses by the selected month
 const updateFilteredExpenses = (allExpenses, monthIndex) => {
  const filteredExpenses = allExpenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === monthIndex;
  });

  setExpenses(filteredExpenses);

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  setTotal(totalExpenses);

  // Calculate expense distribution by type
  const distribution = filteredExpenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
    return acc;
  }, {});

  setExpenseDistribution(distribution);
};


const handleMonthChange = (direction) => {
  let newMonthIndex = selectedMonthIndex;

  if (direction === 'left') {
    newMonthIndex = selectedMonthIndex === 0 ? 11 : selectedMonthIndex - 1;
  } else {
    newMonthIndex = selectedMonthIndex === 11 ? 0 : selectedMonthIndex + 1;
  }

  setSelectedMonthIndex(newMonthIndex);
  updateFilteredExpenses(allExpenses, newMonthIndex); // Filter from the full list
};

 // Automatically navigate to the month of the added expense
 const handleAddExpenseNavigation = (expenseDate) => {
  const expenseMonthIndex = new Date(expenseDate).getMonth();
  setSelectedMonthIndex(expenseMonthIndex);
  updateFilteredExpenses(allExpenses, expenseMonthIndex); // Filter for the added expense's month
};

const deleteExpense = async (expenseId) => {
  try {
    const expenseToDelete = allExpenses.find(
      (expense) => expense.id === expenseId
    );

    await db.collection('expenses').doc(expenseId).delete();

    // Update the full list of expenses by removing the deleted one
    const updatedExpenses = allExpenses.filter(
      (expense) => expense.id !== expenseId
    );
    setAllExpenses(updatedExpenses); // Update the full list of expenses

    // Automatically navigate to the month of the deleted expense
    handleAddExpenseNavigation(expenseToDelete.date);

    // Reapply the filter to the current month after the deletion
    updateFilteredExpenses(updatedExpenses, selectedMonthIndex); // Refresh the filtered expenses

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
      {/* Month Selector */}
      <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Distribute items equally
        paddingHorizontal: 20, // Optional, to give space on left and right
      }}
      >
        <TouchableOpacity onPress={() => handleMonthChange('left')}>
          <Icon.CaretLeft size={24} color="#333" />
        </TouchableOpacity>
        <Title style={{ marginHorizontal: 20 }}>
          {months[selectedMonthIndex]}
        </Title>
        <TouchableOpacity onPress={() => handleMonthChange('right')}>
          <Icon.CaretRight size={24} color="#333" />
        </TouchableOpacity>
      </View>
      {/* PieChart for Expense Distribution */}
      {expenses && expenses.length > 0 && (
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={200}
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
