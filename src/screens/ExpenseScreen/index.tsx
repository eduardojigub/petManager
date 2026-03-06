import React, { useContext, useState } from 'react';
import { FlatList, Alert, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CaretRight, TrashSimple, ArrowsClockwise } from 'phosphor-react-native';
import {
  Container,
  ContentContainer,
  HeaderRow,
  HeaderTitle,
  HeaderSubtitle,
  DogChipsRow,
  DogChip,
  DogChipImage,
  DogChipPlaceholder,
  DogChipPlaceholderText,
  DogChipText,
  MonthSelectorWrapper,
  StatsCard,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  TotalRow,
  TotalLabel,
  TotalValue,
  YearTotalValue,
  FilterTabsContainer,
  FilterTabsRow,
  FilterTab,
  FilterTabText,
  ScrollHint,
  ExpenseCard,
  ExpenseIconContainer,
  ExpenseContent,
  ExpenseTitle,
  ExpenseSubtitle,
  ExpenseRight,
  ExpenseAmount,
  ExpenseDate,
  AddButton,
  AddButtonText,
  DeleteAllButton,
  DeleteAllButtonText,
  SwipeDeleteButton,
  EmptyContainer,
  EmptyImage,
  EmptyText,
  EmptySubtext,
  RecurringBadge,
  RecurringBadgeText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { DogProfile } from '../../types/dogProfile';
import { getExpenseIcon } from '../../utils/iconMappings';
import { confirmDelete } from '../../utils/confirmDelete';
import { formatShortDate } from '../../utils/dateFormarter';
import expensesRecordsImage from '../../assets/expenseScreen.png';
import MonthSelector from '../../components/MonthSelector';
import { StackScreenProps } from '@react-navigation/stack';
import { LanguageContext } from '../../context/LanguageContext';

type ExpenseStackParamList = {
  ExpenseScreen: undefined;
  AddExpense: { expense?: any; addExpense?: (expense: any) => void };
};

type Props = StackScreenProps<ExpenseStackParamList, 'ExpenseScreen'>;

const FILTER_TAB_KEYS = [
  { key: 'expenses.all', value: null },
  { key: 'expenses.food', value: 'Food' },
  { key: 'expenses.medical', value: 'Medical' },
  { key: 'expenses.grooming', value: 'Grooming' },
  { key: 'expenses.toys', value: 'Toys' },
  { key: 'expenses.other', value: 'Other' },
];

const ICON_BG: Record<string, string> = {
  Food: '#e8f5e9',
  Medical: '#e3f2fd',
  Grooming: '#fce4ec',
  Toys: '#fff3e0',
  Other: '#f3e5f5',
};

const ICON_COLOR: Record<string, string> = {
  Food: '#27ae60',
  Medical: '#3498db',
  Grooming: '#e91e63',
  Toys: '#e67e22',
  Other: '#9b59b6',
};

const BORDER_COLOR: Record<string, string> = {
  Food: '#27ae60',
  Medical: '#3498db',
  Grooming: '#e91e63',
  Toys: '#e67e22',
  Other: '#9b59b6',
};

export default function ExpenseScreen({ navigation }: Props) {
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isManualMonthChange, setIsManualMonthChange] = useState(false);
  const [showFilterFade, setShowFilterFade] = useState(true);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadProfiles = async () => {
    if (!userId) return;
    try {
      const snapshot = await getDocs(
        query(collection(db, 'dogProfiles'), where('userId', '==', userId))
      );
      const profiles = snapshot.docs.map((d: any) => ({
        id: d.id,
        ...d.data(),
      })) as DogProfile[];
      setDogProfiles(profiles);
    } catch (error) {
      console.error('Failed to load dog profiles:', error);
    }
  };

  const generateRecurringExpenses = async (
    allExpenses: any[],
    monthIndex: number,
    year: number
  ): Promise<any[]> => {
    const recurringExpenses = allExpenses.filter((e) => e.recurring && e.recurringFrequency);
    const newExpenses: any[] = [];

    for (const expense of recurringExpenses) {
      const originalDate = new Date(expense.date);
      const origMonth = originalDate.getMonth();
      const origYear = originalDate.getFullYear();
      const origDay = originalDate.getDate();

      // Don't generate for months before or equal to the original expense
      if (year < origYear || (year === origYear && monthIndex <= origMonth)) {
        continue;
      }

      let shouldGenerate = false;

      if (expense.recurringFrequency === 'weekly') {
        const diffMs = new Date(year, monthIndex, origDay).getTime() - originalDate.getTime();
        const diffWeeks = diffMs / (7 * 24 * 60 * 60 * 1000);
        shouldGenerate = diffWeeks >= 1;
      } else if (expense.recurringFrequency === 'monthly') {
        shouldGenerate = true;
      } else if (expense.recurringFrequency === 'yearly') {
        shouldGenerate = monthIndex === origMonth;
      }

      if (!shouldGenerate) continue;

      // Check if a recurring copy already exists for this month
      const alreadyExists = allExpenses.some((e) => {
        if (e.recurringSourceId !== expense.id) return false;
        const eDate = new Date(e.date);
        return eDate.getMonth() === monthIndex && eDate.getFullYear() === year;
      });

      if (alreadyExists) continue;

      // Create the recurring copy with the same day in the target month
      const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
      const targetDay = Math.min(origDay, lastDayOfMonth);
      const targetDate = new Date(year, monthIndex, targetDay);

      const newExpense = {
        title: expense.title,
        amount: expense.amount,
        type: expense.type,
        date: targetDate.toISOString(),
        dogId: expense.dogId,
        recurring: false,
        recurringFrequency: null,
        recurringSourceId: expense.id,
      };

      try {
        const docRef = await addDoc(collection(db, 'expenses'), newExpense);
        newExpenses.push({ ...newExpense, id: docRef.id });
      } catch (error) {
        console.error('Error creating recurring expense:', error);
      }
    }

    return newExpenses;
  };

  const fetchExpenses = async (monthIndex: number, year: number) => {
    if (!selectedDog) {
      setExpenses([]);
      setAllExpenses([]);
      return;
    }

    try {
      const snapshot = await getDocs(
        query(collection(db, 'expenses'), where('dogId', '==', selectedDog.id))
      );

      const expensesData = snapshot.docs.map((d: any) => ({
        id: d.id,
        ...d.data(),
      }));

      // Generate recurring expenses for the viewed month
      const generated = await generateRecurringExpenses(expensesData, monthIndex, year);
      const allData = [...expensesData, ...generated];

      const sortedExpenses = allData.sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setAllExpenses(sortedExpenses);
      updateFilteredExpenses(sortedExpenses, monthIndex, year);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const updateFilteredExpenses = (all: any[], monthIndex: number, year: number) => {
    const filtered = all.filter((expense: any) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === monthIndex &&
        expenseDate.getFullYear() === year
      );
    });
    setExpenses(filtered);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!isManualMonthChange) {
        const currentDate = new Date();
        setSelectedMonthIndex(currentDate.getMonth());
        setSelectedYear(currentDate.getFullYear());
      }
      loadProfiles();
      fetchExpenses(selectedMonthIndex, selectedYear);

      return () => {
        setIsManualMonthChange(false);
      };
    }, [selectedDog, selectedMonthIndex, selectedYear, userId])
  );

  const handleSelectDog = async (dog: DogProfile) => {
    setSelectedDog(dog);
    try {
      await AsyncStorage.setItem('selectedDogId', dog.id);
    } catch (error) {
      console.error('Failed to save selected dog ID', error);
    }
  };

  const handleMonthChange = (newMonthIndex: number, newYear: number) => {
    setSelectedMonthIndex(newMonthIndex);
    setSelectedYear(newYear);
    setIsManualMonthChange(true);
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
      const updated = allExpenses.filter((e) => e.id !== expenseId);
      setAllExpenses(updated);
      updateFilteredExpenses(updated, selectedMonthIndex, selectedYear);
      Alert.alert(t('common.success'), t('alert.expenseDeleted'));
    } catch (error) {
      console.error('Error deleting expense:', error);
      Alert.alert(t('common.error'), t('alert.failedDeleteExpense'));
    }
  };

  const handleConfirmDelete = (id: string) => {
    confirmDelete({
      title: t('alert.deleteExpense'),
      message: t('alert.deleteExpenseMsg'),
      onConfirm: () => deleteExpense(id),
    });
  };

  const handleDeleteAll = () => {
    if (expenses.length === 0) return;
    Alert.alert(
      t('alert.deleteAllExpenses'),
      t('alert.deleteAllExpensesMsg', { count: String(expenses.length) }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.deleteAll'),
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                expenses.map(async (e) => {
                  await deleteDoc(doc(db, 'expenses', e.id));
                })
              );
              const updated = allExpenses.filter(
                (e) => !expenses.find((exp) => exp.id === e.id)
              );
              setAllExpenses(updated);
              updateFilteredExpenses(updated, selectedMonthIndex, selectedYear);
              Alert.alert(t('common.success'), t('alert.allExpensesDeleted'));
            } catch (error) {
              console.error('Error deleting all expenses', error);
              Alert.alert(t('common.error'), t('alert.failedDeleteAllExpenses'));
            }
          },
        },
      ]
    );
  };

  const filteredExpenses = activeFilter
    ? expenses.filter((e) => e.type === activeFilter)
    : expenses;

  const monthTotal = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const yearTotal = allExpenses
    .filter((e: any) => new Date(e.date).getFullYear() === selectedYear)
    .reduce((sum: number, e: any) => sum + e.amount, 0);

  // Stats per category for current month
  const foodTotal = expenses.filter((e: any) => e.type === 'Food').reduce((s: number, e: any) => s + e.amount, 0);
  const medicalTotal = expenses.filter((e: any) => e.type === 'Medical').reduce((s: number, e: any) => s + e.amount, 0);
  const groomingTotal = expenses.filter((e: any) => e.type === 'Grooming').reduce((s: number, e: any) => s + e.amount, 0);
  const otherTotal = expenses
    .filter((e: any) => e.type === 'Toys' || e.type === 'Other')
    .reduce((s: number, e: any) => s + e.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
          {/* Header */}
          <HeaderRow>
            <HeaderTitle>{t('expenses.title')}</HeaderTitle>
            {expenses.length > 0 && (
              <DeleteAllButton onPress={handleDeleteAll}>
                <DeleteAllButtonText>{t('common.deleteAll')}</DeleteAllButtonText>
              </DeleteAllButton>
            )}
          </HeaderRow>
          <HeaderSubtitle>
            {selectedDog ? t('expenses.subtitle', { name: selectedDog.name }) : t('expenses.subtitleEmpty')}
          </HeaderSubtitle>

          {/* Dog Chips */}
          {dogProfiles.length > 0 && (
            <DogChipsRow>
              <FlatList
                horizontal
                data={dogProfiles}
                renderItem={({ item }) => {
                  const isSelected = selectedDog?.id === item.id;
                  return (
                    <DogChip selected={isSelected} onPress={() => handleSelectDog(item)}>
                      {item.image ? (
                        <DogChipImage source={{ uri: item.image }} />
                      ) : (
                        <DogChipPlaceholder>
                          <DogChipPlaceholderText>
                            {item.name.charAt(0)}
                          </DogChipPlaceholderText>
                        </DogChipPlaceholder>
                      )}
                      <DogChipText selected={isSelected}>{item.name}</DogChipText>
                    </DogChip>
                  );
                }}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </DogChipsRow>
          )}

          {selectedDog && (
            <>
              {/* Month Selector */}
              <MonthSelectorWrapper>
                <MonthSelector
                  monthIndex={selectedMonthIndex}
                  year={selectedYear}
                  onChange={handleMonthChange}
                />
              </MonthSelectorWrapper>

              {/* Total Card */}
              {expenses.length > 0 && (
                <TotalRow>
                  <TotalLabel>{t('expenses.monthTotal')}</TotalLabel>
                  <TotalValue>{formatCurrency(monthTotal)}</TotalValue>
                  <YearTotalValue>{t('common.year')}: {formatCurrency(yearTotal)}</YearTotalValue>
                </TotalRow>
              )}

              {/* Stats */}
              {expenses.length > 0 && (
                <StatsCard>
                  <StatsRow>
                    <StatCard>
                      <StatValue color="#27ae60">{formatCurrency(foodTotal)}</StatValue>
                      <StatLabel>{t('expenses.food')}</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue color="#3498db">{formatCurrency(medicalTotal)}</StatValue>
                      <StatLabel>{t('expenses.medical')}</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue color="#e91e63">{formatCurrency(groomingTotal)}</StatValue>
                      <StatLabel>{t('expenses.grooming')}</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue color="#e67e22">{formatCurrency(otherTotal)}</StatValue>
                      <StatLabel>{t('expenses.other')}</StatLabel>
                    </StatCard>
                  </StatsRow>
                </StatsCard>
              )}

              {/* Filter Tabs */}
              <FilterTabsContainer>
                <FilterTabsRow>
                  <FlatList
                    horizontal
                    data={FILTER_TAB_KEYS}
                    renderItem={({ item }) => {
                      const isSelected = activeFilter === item.value;
                      return (
                        <FilterTab
                          selected={isSelected}
                          onPress={() => setActiveFilter(item.value)}
                        >
                          <FilterTabText selected={isSelected}>{t(item.key)}</FilterTabText>
                        </FilterTab>
                      );
                    }}
                    keyExtractor={(item) => item.key}
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
                      const isAtEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 10;
                      if (isAtEnd && showFilterFade) setShowFilterFade(false);
                      else if (!isAtEnd && !showFilterFade) setShowFilterFade(true);
                    }}
                    scrollEventThrottle={16}
                  />
                </FilterTabsRow>
                {showFilterFade && (
                  <ScrollHint>
                    <CaretRight size={16} color="#999" />
                  </ScrollHint>
                )}
              </FilterTabsContainer>

              {/* Add Button */}
              <AddButton
                onPress={() =>
                  navigation.navigate('AddExpense', {
                    addExpense: () => {
                      fetchExpenses(selectedMonthIndex, selectedYear);
                    },
                  })
                }
              >
                <AddButtonText>{t('expenses.addExpense')}</AddButtonText>
              </AddButton>

              {/* Expense Cards */}
              {filteredExpenses.length > 0 ? (
                <>
                  {filteredExpenses.map((item) => (
                    <Swipeable
                      key={item.id}
                      renderRightActions={() => (
                        <SwipeDeleteButton onPress={() => handleConfirmDelete(item.id)}>
                          <TrashSimple size={22} color="#fff" />
                        </SwipeDeleteButton>
                      )}
                      overshootRight={false}
                    >
                      <ExpenseCard
                        borderColor={BORDER_COLOR[item.type] || '#41245c'}
                        onPress={() =>
                          navigation.navigate('AddExpense', { expense: item })
                        }
                      >
                        <ExpenseIconContainer bgColor={ICON_BG[item.type] || '#f0eff4'}>
                          {getExpenseIcon(item.type, 20, ICON_COLOR[item.type] || '#41245c')}
                        </ExpenseIconContainer>
                        <ExpenseContent>
                          <ExpenseTitle>{item.title}</ExpenseTitle>
                          <ExpenseSubtitle>{item.type}</ExpenseSubtitle>
                          {item.recurring && (
                            <RecurringBadge>
                              <ArrowsClockwise size={10} color="#41245c" />
                              <RecurringBadgeText>
                                {item.recurringFrequency === 'weekly' ? t('expenses.weekly') :
                                 item.recurringFrequency === 'yearly' ? t('expenses.yearly') : t('expenses.monthly')}
                              </RecurringBadgeText>
                            </RecurringBadge>
                          )}
                        </ExpenseContent>
                        <ExpenseRight>
                          <ExpenseAmount>{formatCurrency(item.amount)}</ExpenseAmount>
                          <ExpenseDate>{formatShortDate(item.date)}</ExpenseDate>
                        </ExpenseRight>
                      </ExpenseCard>
                    </Swipeable>
                  ))}
                </>
              ) : (
                <EmptyContainer>
                  <EmptyText>{t('expenses.noExpenses')}</EmptyText>
                  <EmptySubtext>{t('expenses.noExpensesSub')}</EmptySubtext>
                </EmptyContainer>
              )}
            </>
          )}

          {!selectedDog && dogProfiles.length === 0 && (
            <EmptyContainer>
              <EmptyImage source={expensesRecordsImage} resizeMode="contain" />
              <EmptyText>{t('expenses.noPets')}</EmptyText>
              <EmptySubtext>{t('expenses.noPetsSub')}</EmptySubtext>
            </EmptyContainer>
          )}
        </ContentContainer>
      </ScrollView>
    </Container>
  );
}
