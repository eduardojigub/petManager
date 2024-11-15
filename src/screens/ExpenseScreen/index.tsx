import React, { useContext, useState } from 'react';
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
  MonthSelectorContainer,
  MonthButton,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const screenWidth = Dimensions.get('window').width;
  const [isManualMonthChange, setIsManualMonthChange] = useState(false); // To track manual month changes
  const navigation = useNavigation();
  const [isExpenseAdded, setIsExpenseAdded] = useState(false); // New flag to handle added expense
  const route = useRoute();

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
  // Fetch expenses function
// Fetch expenses function
const fetchExpenses = async (monthIndex, year) => {
  if (!selectedDog) return;

  try {
    const snapshot = await db
      .collection('expenses')
      .where('dogId', '==', selectedDog.id)
      .get();

    const expensesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const sortedExpenses = expensesData.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllExpenses(sortedExpenses);

    // Filter the list based on the selected month and year
    updateFilteredExpenses(sortedExpenses, monthIndex, year);
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
};

 // UseFocusEffect to handle focus change and resetting month when navigating back
  // UseFocusEffect to handle focus change and resetting month when navigating back
  useFocusEffect(
    React.useCallback(() => {
      // If the expense was added, don't reset to the current month
      if (!isExpenseAdded && !isManualMonthChange) {
        const currentDate = new Date();
        setSelectedMonthIndex(currentDate.getMonth());
        setSelectedYear(currentDate.getFullYear());
      }

      // Fetch expenses for the current month and year
      fetchExpenses(selectedMonthIndex, selectedYear);

      return () => {
        setIsManualMonthChange(false);
        setIsExpenseAdded(false); // Reset the flag
      };
    }, [selectedDog, selectedMonthIndex, selectedYear, isExpenseAdded])
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

  // Handle filtering expenses based on the selected month and year
  const updateFilteredExpenses = (allExpenses, monthIndex, year) => {
    const filteredExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === monthIndex &&
        expenseDate.getFullYear() === year
      );
    });

    setExpenses(filteredExpenses);

    const totalExpenses = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    setTotal(totalExpenses);

    const distribution = filteredExpenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {});

    setExpenseDistribution(distribution);
  };
 // Handle month changes (left or right navigation)

  // Handle month changes (left or right navigation)
  const handleMonthChange = (direction) => {
    let newMonthIndex = selectedMonthIndex;
    let newYear = selectedYear;

    if (direction === 'left') {
      newMonthIndex = newMonthIndex === 0 ? 11 : newMonthIndex - 1;
      newYear = newMonthIndex === 11 ? newYear - 1 : newYear;
    } else {
      newMonthIndex = newMonthIndex === 11 ? 0 : newMonthIndex + 1;
      newYear = newMonthIndex === 0 ? newYear + 1 : newYear;
    }

    setSelectedMonthIndex(newMonthIndex);
    setSelectedYear(newYear);
    setIsManualMonthChange(true);

    // Fetch expenses for the new month and year
    fetchExpenses(newMonthIndex, newYear);
  };


 // Update selected month/year and re-fetch expenses when an expense is added
 const handleAddExpenseNavigation = (expenseDate) => {
  const expenseMonthIndex = new Date(expenseDate).getMonth();
  const expenseYear = new Date(expenseDate).getFullYear();

  // Navigate to the added expense's month and year
  setSelectedMonthIndex(expenseMonthIndex);
  setSelectedYear(expenseYear);
  setIsExpenseAdded(true); // Set flag to prevent automatic reset

  // Re-fetch expenses for the added expense's month/year
  fetchExpenses(expenseMonthIndex, expenseYear);
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

        // Use Intl.NumberFormat to format the amount with commas
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  }).format(item.amount);

    return (
      <ExpenseItem
        onPress={() => navigation.navigate('AddExpense', { expense: item })}
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
        {formattedAmount}
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
      {selectedDog && 
      <MonthSelectorContainer>
        <MonthButton onPress={() => handleMonthChange('left')}>
          <Icon.CaretLeft size={24} color="#333" />
        </MonthButton>

        <Title>{`${months[selectedMonthIndex]}, ${selectedYear}`}</Title>

        <MonthButton onPress={() => handleMonthChange('right')}>
          <Icon.CaretRight size={24} color="#333" />
        </MonthButton>
      </MonthSelectorContainer>
      }
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
          <AddButton
          onPress={() =>
            navigation.navigate('AddExpense', {
              addExpense: (newExpense) => {
                handleAddExpenseNavigation(newExpense.date);
                // Immediately refetch expenses after adding a new one
                fetchExpenses(); // or alternatively call updateFilteredExpenses with the correct month/year
              },
            })
          }
        >
          <ButtonText>Add Expense</ButtonText>
        </AddButton>
        )}
      </>
    </Container>
  );
}
