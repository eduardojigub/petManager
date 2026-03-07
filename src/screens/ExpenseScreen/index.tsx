import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import {
  Container,
  ContentContainer,
  HeaderRow,
  HeaderTitle,
  HeaderSubtitle,
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
  AddButton,
  AddButtonText,
  DeleteAllButton,
  DeleteAllButtonText,
  EmptyContainer,
  EmptyImage,
  EmptyText,
  EmptySubtext,
} from './styles';
import { LanguageContext } from '../../context/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';
import { useDogProfiles } from '../../hooks/useDogProfiles';
import { useExpenses } from './hooks/useExpenses';
import DogChipSelector from '../../components/DogChipSelector';
import FilterTabs from '../../components/FilterTabs';
import ExpenseCardItem from './components/ExpenseCardItem';
import MonthSelector from '../../components/MonthSelector';
import expensesRecordsImage from '../../assets/expenseScreen.png';
import { StackScreenProps } from '@react-navigation/stack';

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export default function ExpenseScreen({ navigation }: Props) {
  const { t } = useContext(LanguageContext);
  const { dogProfiles, selectedDog, userId, loadProfiles, handleSelectDog } = useDogProfiles();
  const { expenses, allExpenses, isLoading, fetchExpenses, handleConfirmDelete, handleDeleteAll } = useExpenses();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isManualMonthChange, setIsManualMonthChange] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!isManualMonthChange) {
        const now = new Date();
        setSelectedMonthIndex(now.getMonth());
        setSelectedYear(now.getFullYear());
      }
      loadProfiles();
      return () => setIsManualMonthChange(false);
    }, [userId, loadProfiles])
  );

  useEffect(() => {
    fetchExpenses(selectedMonthIndex, selectedYear);
  }, [selectedDog, selectedMonthIndex, selectedYear]);

  const handleMonthChange = (monthIndex: number, year: number) => {
    setSelectedMonthIndex(monthIndex);
    setSelectedYear(year);
    setIsManualMonthChange(true);
  };

  const filteredExpenses = activeFilter
    ? expenses.filter((e) => e.type === activeFilter)
    : expenses;

  const monthTotal = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const yearTotal = allExpenses
    .filter((e: any) => new Date(e.date).getFullYear() === selectedYear)
    .reduce((sum: number, e: any) => sum + e.amount, 0);

  const foodTotal = expenses.filter((e: any) => e.type === 'Food').reduce((s: number, e: any) => s + e.amount, 0);
  const medicalTotal = expenses.filter((e: any) => e.type === 'Medical').reduce((s: number, e: any) => s + e.amount, 0);
  const groomingTotal = expenses.filter((e: any) => e.type === 'Grooming').reduce((s: number, e: any) => s + e.amount, 0);
  const otherTotal = expenses.filter((e: any) => e.type === 'Toys' || e.type === 'Other').reduce((s: number, e: any) => s + e.amount, 0);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
          <HeaderRow>
            <HeaderTitle>{t('expenses.title')}</HeaderTitle>
            {expenses.length > 0 && (
              <DeleteAllButton onPress={() => handleDeleteAll(selectedMonthIndex, selectedYear)}>
                <DeleteAllButtonText>{t('common.deleteAll')}</DeleteAllButtonText>
              </DeleteAllButton>
            )}
          </HeaderRow>
          <HeaderSubtitle>
            {selectedDog ? t('expenses.subtitle', { name: selectedDog.name }) : t('expenses.subtitleEmpty')}
          </HeaderSubtitle>

          <DogChipSelector
            dogProfiles={dogProfiles}
            selectedDogId={selectedDog?.id}
            onSelectDog={handleSelectDog}
          />

          {selectedDog && (
            <>
              <MonthSelectorWrapper>
                <MonthSelector monthIndex={selectedMonthIndex} year={selectedYear} onChange={handleMonthChange} />
              </MonthSelectorWrapper>

              {expenses.length > 0 && (
                <>
                  <TotalRow>
                    <TotalLabel>{t('expenses.monthTotal')}</TotalLabel>
                    <TotalValue>{formatCurrency(monthTotal)}</TotalValue>
                    <YearTotalValue>{t('common.year')}: {formatCurrency(yearTotal)}</YearTotalValue>
                  </TotalRow>
                  <StatsCard>
                    <StatsRow>
                      <StatCard><StatValue color="#27ae60">{formatCurrency(foodTotal)}</StatValue><StatLabel>{t('expenses.food')}</StatLabel></StatCard>
                      <StatCard><StatValue color="#3498db">{formatCurrency(medicalTotal)}</StatValue><StatLabel>{t('expenses.medical')}</StatLabel></StatCard>
                      <StatCard><StatValue color="#e91e63">{formatCurrency(groomingTotal)}</StatValue><StatLabel>{t('expenses.grooming')}</StatLabel></StatCard>
                      <StatCard><StatValue color="#e67e22">{formatCurrency(otherTotal)}</StatValue><StatLabel>{t('expenses.other')}</StatLabel></StatCard>
                    </StatsRow>
                  </StatsCard>
                </>
              )}

              <FilterTabs
                tabs={FILTER_TAB_KEYS}
                activeValue={activeFilter}
                onSelect={setActiveFilter}
                showScrollHint
                renderLabel={(tab) => t(tab.key)}
              />

              <AddButton onPress={() => navigation.navigate('AddExpense', { addExpense: () => fetchExpenses(selectedMonthIndex, selectedYear) })}>
                <AddButtonText>{t('expenses.addExpense')}</AddButtonText>
              </AddButton>

              {isLoading ? (
                <ActivityIndicator size="large" color="#41245c" style={{ marginVertical: 32 }} />
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((item) => (
                  <ExpenseCardItem
                    key={item.id}
                    item={item}
                    onDelete={(id) => handleConfirmDelete(id, selectedMonthIndex, selectedYear)}
                    onPress={(e) => navigation.navigate('AddExpense', { expense: e })}
                    formatCurrency={formatCurrency}
                    t={t}
                  />
                ))
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
