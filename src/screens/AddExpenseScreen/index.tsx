import React, { useContext, useState } from 'react';
import {
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  Container,
  Title,
  Input,
  CustomButton,
  ButtonText,
  DatePickerButton,
  DatePickerText,
  KeyboardAvoidingContainer,
} from './styles';

import {
  TypeSelector,
  TypeOption,
  TypeText,
} from '../../styles/shared';

import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import DatePickerField from '../../components/DatePickerField';
import { EXPENSE_TYPES } from '../../constants/typeOptions';

export default function AddExpenseScreen({ navigation, route }: any) {
  const { expense } = route.params || {};

  const [expenseTitle, setExpenseTitle] = useState(expense?.title || '');
  const [amount, setAmount] = useState(expense?.amount ? String(expense.amount) : '');
  const [date, setDate] = useState( expense?.date ? new Date(expense.date) : new Date());
  const [type, setType] = useState( expense?.type || '');
  const { selectedDog } = useContext(DogProfileContext);

  const handleAmountChange = (value) => {
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
  if (!expenseTitle || !amount || !date || !type) {
    Alert.alert('Please fill out all fields');
    return;
  }

  const cleanedAmount = amount.replace(/,/g, '');

  const newExpense = {
    title: expenseTitle,
    amount: parseFloat(cleanedAmount),
    type,
    date: date.toISOString(),
    dogId: selectedDog.id,
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
    Alert.alert('Error', 'Unable to save the expense.');
  }
};
  return (
    <KeyboardAvoidingContainer
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
        <Title>{expense ? 'Edit Expense' : 'Add Expense'}</Title>

          <TypeSelector>
            {EXPENSE_TYPES.map((item) => (
              <TypeOption
                key={item.label}
                onPress={() => setType(item.label)}
                selected={type === item.label}
              >
                {item.icon}
                <TypeText selected={type === item.label}>{item.label}</TypeText>
              </TypeOption>
            ))}
          </TypeSelector>

          <Input
            value={expenseTitle}
            onChangeText={setExpenseTitle}
            placeholder="Expense title"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <Input
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="Amount ($): Example: 10.99"
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <DatePickerField
            value={date}
            onChange={setDate}
            mode="date"
            label="Select Date"
            renderButton={(onPress, displayText) => (
              <DatePickerButton onPress={onPress}>
                <DatePickerText>{displayText}</DatePickerText>
              </DatePickerButton>
            )}
          />

          <CustomButton onPress={handleSave}>
          <ButtonText>{expense ? 'Update Expense' : 'Save Expense'}</ButtonText>
          </CustomButton>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}
