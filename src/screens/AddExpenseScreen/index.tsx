import React, { useContext, useState } from 'react';
import {
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
} from 'react-native';
import { CalendarBlank, ArrowsClockwise } from 'phosphor-react-native';
import {
  KeyboardAvoidingContainer,
  Container,
  ContentContainer,
  SectionTitle,
  TypeGrid,
  TypeChip,
  TypeChipText,
  FormCard,
  InputGroup,
  InputLabel,
  StyledInput,
  DateButton,
  DateButtonText,
  RecurringRow,
  RecurringLabel,
  FrequencyChipsRow,
  FrequencyChip,
  FrequencyChipText,
  SaveButton,
  SaveButtonText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import DatePickerField from '../../components/DatePickerField';
import { EXPENSE_TYPES } from '../../constants/typeOptions';
import { getExpenseIcon } from '../../utils/iconMappings';
import { LanguageContext } from '../../context/LanguageContext';

const TYPE_COLOR: Record<string, string> = {
  Food: '#27ae60',
  Medical: '#3498db',
  Grooming: '#e91e63',
  Toys: '#e67e22',
  Other: '#9b59b6',
};

const TYPE_BG: Record<string, string> = {
  Food: '#e8f5e9',
  Medical: '#e3f2fd',
  Grooming: '#fce4ec',
  Toys: '#fff3e0',
  Other: '#f3e5f5',
};

const FREQUENCY_OPTIONS = [
  { key: 'add.weekly', value: 'weekly' },
  { key: 'add.monthly', value: 'monthly' },
  { key: 'add.yearly', value: 'yearly' },
] as const;

export default function AddExpenseScreen({ navigation, route }: any) {
  const { expense } = route.params || {};
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const [expenseTitle, setExpenseTitle] = useState(expense?.title || '');
  const [amount, setAmount] = useState(expense?.amount ? String(expense.amount) : '');
  const [date, setDate] = useState(expense?.date ? new Date(expense.date) : new Date());
  const [type, setType] = useState(expense?.type || '');
  const [recurring, setRecurring] = useState(expense?.recurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'monthly' | 'yearly'>(
    expense?.recurringFrequency || 'monthly'
  );

  const handleAmountChange = (value: string) => {
    let cleaned = value.replace(/[^0-9.]/g, '');

    const [integerPart, decimalPart] = cleaned.split('.');

    if (integerPart === '' && cleaned === '.') {
      setAmount('0.');
      return;
    }

    if (cleaned.split('.').length > 2) {
      return;
    }

    const limitedDecimalPart = decimalPart ? decimalPart.substring(0, 2) : '';

    const formattedIntegerPart = integerPart
      ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : '';

    if (decimalPart !== undefined) {
      setAmount(`${formattedIntegerPart}.${limitedDecimalPart}`);
    } else {
      setAmount(formattedIntegerPart);
    }
  };

  const handleSave = async () => {
    if (!type) {
      Alert.alert(t('common.error'), t('alert.selectType'));
      return;
    }
    if (!expenseTitle.trim()) {
      Alert.alert(t('common.error'), t('alert.addTitle'));
      return;
    }
    if (!amount) {
      Alert.alert(t('common.error'), t('alert.addAmount'));
      return;
    }

    const cleanedAmount = amount.replace(/,/g, '');

    const newExpense = {
      title: expenseTitle,
      amount: parseFloat(cleanedAmount),
      type,
      date: date.toISOString(),
      dogId: selectedDog.id,
      recurring,
      recurringFrequency: recurring ? recurringFrequency : null,
    };

    try {
      if (expense) {
        await updateDoc(doc(db, 'expenses', expense.id), newExpense);
      } else {
        const docRef = await addDoc(collection(db, 'expenses'), newExpense);
        const addedExpense = { ...newExpense, id: docRef.id };
        if (route.params?.addExpense) route.params.addExpense(addedExpense);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving expense', error);
      Alert.alert(t('common.error'), t('alert.failedSaveExpense'));
    }
  };

  return (
    <KeyboardAvoidingContainer
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <ContentContainer>
            <SectionTitle>{t('add.selectType')}</SectionTitle>
            <TypeGrid>
              {EXPENSE_TYPES.map((item) => {
                const isSelected = type === item.label;
                const color = TYPE_COLOR[item.label] || '#41245c';
                const bg = TYPE_BG[item.label] || '#f0eff4';
                return (
                  <TypeChip
                    key={item.label}
                    selected={isSelected}
                    selectedBg={bg}
                    onPress={() => setType(item.label)}
                  >
                    {getExpenseIcon(item.label, 20, color)}
                    <TypeChipText selected={isSelected} selectedColor={color}>
                      {item.label}
                    </TypeChipText>
                  </TypeChip>
                );
              })}
            </TypeGrid>

            {type ? (
              <>
                <FormCard>
                  <InputGroup>
                    <InputLabel>{t('add.title')}</InputLabel>
                    <StyledInput
                      value={expenseTitle}
                      onChangeText={setExpenseTitle}
                      placeholder={t('add.titlePlaceholder')}
                      placeholderTextColor="#ccc"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{t('add.amount')}</InputLabel>
                    <StyledInput
                      value={amount}
                      onChangeText={handleAmountChange}
                      placeholder="0.00"
                      placeholderTextColor="#ccc"
                      keyboardType="numeric"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{t('add.date')}</InputLabel>
                    <DatePickerField
                      value={date}
                      onChange={setDate}
                      mode="date"
                      label={t('add.selectDate')}
                      renderButton={(onPress, displayText) => (
                        <DateButton onPress={onPress}>
                          <CalendarBlank size={20} color="#41245c" />
                          <DateButtonText hasValue>{displayText}</DateButtonText>
                        </DateButton>
                      )}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{t('add.recurring')}</InputLabel>
                    <RecurringRow>
                      <ArrowsClockwise size={20} color="#41245c" />
                      <RecurringLabel>{t('add.repeatExpense')}</RecurringLabel>
                      <Switch
                        value={recurring}
                        onValueChange={setRecurring}
                        trackColor={{ false: '#ddd', true: '#7289da' }}
                        thumbColor={recurring ? '#41245c' : '#f4f3f4'}
                      />
                    </RecurringRow>
                    {recurring && (
                      <FrequencyChipsRow>
                        {FREQUENCY_OPTIONS.map((option) => (
                          <FrequencyChip
                            key={option.value}
                            selected={recurringFrequency === option.value}
                            onPress={() => setRecurringFrequency(option.value)}
                          >
                            <FrequencyChipText selected={recurringFrequency === option.value}>
                              {t(option.key)}
                            </FrequencyChipText>
                          </FrequencyChip>
                        ))}
                      </FrequencyChipsRow>
                    )}
                  </InputGroup>
                </FormCard>

                <SaveButton onPress={handleSave}>
                  <SaveButtonText>
                    {expense ? t('add.updateExpense') : t('add.saveExpense')}
                  </SaveButtonText>
                </SaveButton>
              </>
            ) : null}
          </ContentContainer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}
