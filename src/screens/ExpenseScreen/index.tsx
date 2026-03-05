import React, { useContext, useState } from 'react';
import { FlatList, Alert } from 'react-native';
import {
  Container,
  ButtonText,
  ExpenseItem,
  ExpenseItemText,
  ExpenseIconContainer,
  ExpenseDateText,
  AddButton,
  TotalText,
  ListItemDetailHint,
  TrashIconContainer,
  ExpenseItemContent,
  ExpenseAmountText,
  TotalRow,
  YearTotalText,
  FadeDivider,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import * as Icon from 'phosphor-react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import expensesRecordsImage from '../../assets/expenseScreen.png';
import EmptyStateList from '../../components/EmptyStateList';
import MonthSelector from '../../components/MonthSelector';

export default function ExpenseScreen() {
  const { selectedDog } = useContext(DogProfileContext);
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [expenseDistribution, setExpenseDistribution] = useState({});
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const screenWidth = Dimensions.get('window').width;
  const [isManualMonthChange, setIsManualMonthChange] = useState(false);
  const navigation = useNavigation();
  const [isExpenseAdded, setIsExpenseAdded] = useState(false);
  const route = useRoute();

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

      const sortedExpenses = expensesData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setAllExpenses(sortedExpenses);
      updateFilteredExpenses(sortedExpenses, monthIndex, year);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!isExpenseAdded && !isManualMonthChange) {
        const currentDate = new Date();
        setSelectedMonthIndex(currentDate.getMonth());
        setSelectedYear(currentDate.getFullYear());
      }

      fetchExpenses(selectedMonthIndex, selectedYear);

      return () => {
        setIsManualMonthChange(false);
        setIsExpenseAdded(false);
      };
    }, [selectedDog, selectedMonthIndex, selectedYear, isExpenseAdded])
  );

  const chartData = Object.keys(expenseDistribution).map((type, index) => ({
    name: `${type}`,
    amount: expenseDistribution[type],
    color: ['#7289DA', '#FFA726', '#66BB6A', '#EF5350', '#AB47BC'][index % 5],
    legendFontColor: '#333',
    legendFontSize: 15,
  }));

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

  const handleMonthChange = (newMonthIndex, newYear) => {
    setSelectedMonthIndex(newMonthIndex);
    setSelectedYear(newYear);
    setIsManualMonthChange(true);
    fetchExpenses(newMonthIndex, newYear);
  };

  const handleAddExpenseNavigation = (expenseDate) => {
    const expenseMonthIndex = new Date(expenseDate).getMonth();
    const expenseYear = new Date(expenseDate).getFullYear();

    setSelectedMonthIndex(expenseMonthIndex);
    setSelectedYear(expenseYear);
    setIsExpenseAdded(true);
    fetchExpenses(expenseMonthIndex, expenseYear);
  };

  const deleteExpense = async (expenseId) => {
    try {
      const expenseToDelete = allExpenses.find(
        (expense) => expense.id === expenseId
      );

      await db.collection('expenses').doc(expenseId).delete();

      const updatedExpenses = allExpenses.filter(
        (expense) => expense.id !== expenseId
      );
      setAllExpenses(updatedExpenses);

      handleAddExpenseNavigation(expenseToDelete.date);
      updateFilteredExpenses(updatedExpenses, selectedMonthIndex, selectedYear);
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

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(item.amount);

    return (
      <ExpenseItem onPress={() => navigation.navigate('AddExpense', { expense: item })}>
        <ExpenseIconContainer>{getExpenseIcon(item.type)}</ExpenseIconContainer>
        <ExpenseItemContent>
          <ExpenseItemText>{item.title}</ExpenseItemText>
          <ListItemDetailHint>
            <ExpenseDateText>{formattedDate}</ExpenseDateText>
          </ListItemDetailHint>
        </ExpenseItemContent>
        <ExpenseAmountText>
          {formattedAmount}
        </ExpenseAmountText>
        <TrashIconContainer onPress={() => handleDeleteExpense(item.id)}>
          <Icon.TrashSimple size={20} color="#FF5C5C" />
        </TrashIconContainer>
      </ExpenseItem>
    );
  };

  return (
    <Container>
      {selectedDog && (
        <MonthSelector
          monthIndex={selectedMonthIndex}
          year={selectedYear}
          onChange={handleMonthChange}
        />
      )}

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

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyStateList
            image={expensesRecordsImage}
            text="No expenses yet. Add your first pet and start adding records to keep track of your expenses."
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {expenses && expenses.length > 0 && (
        <FadeDivider />
      )}

      <>
        {selectedDog && expenses.length > 0 && (
          <TotalRow>
            <YearTotalText>
              Year: $
              {allExpenses
                .filter((expense) => expense.date.includes(selectedYear))
                .reduce((total, expense) => total + expense.amount, 0)
                .toFixed(2)}{' '}
            </YearTotalText>
            <TotalText>Month: ${total.toFixed(2)}</TotalText>
          </TotalRow>
        )}

        {selectedDog && (
          <AddButton
            onPress={() =>
              navigation.navigate('AddExpense', {
                addExpense: (newExpense) => {
                  handleAddExpenseNavigation(newExpense.date);
                  fetchExpenses();
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
